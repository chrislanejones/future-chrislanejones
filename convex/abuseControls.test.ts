/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import rateLimiterTest from "@convex-dev/rate-limiter/test";
import { api } from "./_generated/api";
import schema from "./schema";
import { parseOwnerAllowlist } from "./ownerPolicy";

const modules = import.meta.glob("./**/*.ts");

function setup() {
  const t = convexTest(schema, modules);
  rateLimiterTest.register(t);
  return t;
}

async function insertPost(
  t: ReturnType<typeof setup>,
  published: boolean,
  slug = published ? "live" : "draft",
) {
  return await t.run((ctx) =>
    ctx.db.insert("blogPosts", {
      title: slug,
      slug,
      excerpt: "",
      content: "",
      published,
      likesCount: 0,
      createdAt: 0,
      updatedAt: 0,
    }),
  );
}

const contact = {
  name: "Ada",
  email: "ada@example.com",
  message: "Hello there, a real message.",
  source: "contact-page",
};

describe("contactMessages.create", () => {
  test("accepts a normal submission and trims fields", async () => {
    const t = setup();
    await t.mutation(api.contactMessages.create, {
      ...contact,
      name: "  Ada  ",
      phone: "  ",
    });
    const rows = await t.run((ctx) => ctx.db.query("contactMessages").collect());
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Ada");
    expect(rows[0].phone).toBeUndefined();
  });

  test.each([
    ["blank name", { name: "   " }],
    ["blank message", { message: "\n\t " }],
    ["bad email", { email: "not-an-email" }],
    ["unknown source", { source: "/evil" }],
  ])("rejects %s without writing", async (_label, patch) => {
    const t = setup();
    await expect(
      t.mutation(api.contactMessages.create, { ...contact, ...patch }),
    ).rejects.toThrow();
    const rows = await t.run((ctx) => ctx.db.query("contactMessages").collect());
    expect(rows).toHaveLength(0);
  });

  test("a burst from one sender hits the limit and writes nothing more", async () => {
    const t = setup();
    for (let i = 0; i < 5; i++) {
      await t.mutation(api.contactMessages.create, contact);
    }
    await expect(
      t.mutation(api.contactMessages.create, {
        ...contact,
        email: "ADA@example.com",
      }),
    ).rejects.toThrow(/Too many requests/);
    const rows = await t.run((ctx) => ctx.db.query("contactMessages").collect());
    expect(rows).toHaveLength(5);
  });

  test("rotating emails still hits the global budget", async () => {
    const t = setup();
    for (let i = 0; i < 30; i++) {
      await t.mutation(api.contactMessages.create, {
        ...contact,
        email: `user${i}@example.com`,
      });
    }
    await expect(
      t.mutation(api.contactMessages.create, {
        ...contact,
        email: "fresh@example.com",
      }),
    ).rejects.toThrow(/Too many requests/);
  });
});

describe("blogPosts.addComment", () => {
  const comment = {
    authorName: "Bo",
    authorEmail: "bo@example.com",
    content: "Nice post",
  };

  test("accepts a comment on a published post, unapproved", async () => {
    const t = setup();
    const postId = await insertPost(t, true);
    await t.mutation(api.blogPosts.addComment, { postId, ...comment });
    const rows = await t.run((ctx) => ctx.db.query("blogComments").collect());
    expect(rows).toHaveLength(1);
    expect(rows[0].approved).toBe(false);
  });

  test("rejects unpublished posts and blank content", async () => {
    const t = setup();
    const draft = await insertPost(t, false);
    const live = await insertPost(t, true);
    await expect(
      t.mutation(api.blogPosts.addComment, { postId: draft, ...comment }),
    ).rejects.toThrow(/Post not found/);
    await expect(
      t.mutation(api.blogPosts.addComment, {
        postId: live,
        ...comment,
        content: "   ",
      }),
    ).rejects.toThrow();
    const rows = await t.run((ctx) => ctx.db.query("blogComments").collect());
    expect(rows).toHaveLength(0);
  });

  test("rejects a reply whose parent belongs to another post", async () => {
    const t = setup();
    const a = await insertPost(t, true, "a");
    const b = await insertPost(t, true, "b");
    const parentId = await t.mutation(api.blogPosts.addComment, {
      postId: a,
      ...comment,
    });
    await expect(
      t.mutation(api.blogPosts.addComment, { postId: b, parentId, ...comment }),
    ).rejects.toThrow(/Parent comment not found/);
    await t.mutation(api.blogPosts.addComment, {
      postId: a,
      parentId,
      ...comment,
    });
  });

  test("a burst from one author hits the limit", async () => {
    const t = setup();
    const postId = await insertPost(t, true);
    for (let i = 0; i < 10; i++) {
      await t.mutation(api.blogPosts.addComment, { postId, ...comment });
    }
    await expect(
      t.mutation(api.blogPosts.addComment, { postId, ...comment }),
    ).rejects.toThrow(/Too many requests/);
    const rows = await t.run((ctx) => ctx.db.query("blogComments").collect());
    expect(rows).toHaveLength(10);
  });
});

describe("blogPosts.toggleLike", () => {
  test("toggles on a published post and keeps the counter in sync", async () => {
    const t = setup();
    const postId = await insertPost(t, true);
    const args = { postId, userIdentifier: "visitor-1" };
    expect(await t.mutation(api.blogPosts.toggleLike, args)).toEqual({ liked: true });
    expect(await t.mutation(api.blogPosts.toggleLike, args)).toEqual({ liked: false });
    const post = await t.run((ctx) => ctx.db.get(postId));
    expect(post?.likesCount).toBe(0);
  });

  test("rejects unpublished posts", async () => {
    const t = setup();
    const postId = await insertPost(t, false);
    await expect(
      t.mutation(api.blogPosts.toggleLike, { postId, userIdentifier: "v" }),
    ).rejects.toThrow(/Post not found/);
  });

  test("a burst from one visitor hits the limit", async () => {
    const t = setup();
    const postId = await insertPost(t, true);
    const args = { postId, userIdentifier: "visitor-1" };
    for (let i = 0; i < 60; i++) {
      await t.mutation(api.blogPosts.toggleLike, args);
    }
    await expect(t.mutation(api.blogPosts.toggleLike, args)).rejects.toThrow(
      /Too many requests/,
    );
  });
});

describe("owner policy", () => {
  test("parses and fails closed in production", () => {
    expect(parseOwnerAllowlist(" a , b ,", { production: true })).toEqual(["a", "b"]);
    expect(parseOwnerAllowlist(undefined, { production: true })).toEqual([]);
    expect(parseOwnerAllowlist(" , ", { production: true })).toEqual([]);
    expect(parseOwnerAllowlist("", { production: false }).length).toBe(1);
  });

  test("admin queries return nothing to non-owners", async () => {
    const t = setup();
    await t.mutation(api.contactMessages.create, contact);
    expect(await t.query(api.contactMessages.getAll, {})).toEqual([]);
    const stranger = t.withIdentity({ subject: "user_stranger" });
    expect(await stranger.query(api.contactMessages.getAll, {})).toEqual([]);
  });

  test("an allowlisted owner can read admin data", async () => {
    const t = setup();
    await t.mutation(api.contactMessages.create, contact);
    const previous = process.env.ADMIN_USER_IDS;
    process.env.ADMIN_USER_IDS = "user_owner";
    try {
      const owner = t.withIdentity({ subject: "user_owner" });
      expect(await owner.query(api.contactMessages.getAll, {})).toHaveLength(1);
      expect(await owner.query(api.contactMessages.getUnreadCount, {})).toBe(1);
    } finally {
      process.env.ADMIN_USER_IDS = previous;
    }
  });
});
