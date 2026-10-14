/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");
const OWNER = "user_owner_test";

describe("project update", () => {
  const saved = process.env.ADMIN_USER_IDS;
  beforeEach(() => {
    process.env.ADMIN_USER_IDS = OWNER;
  });
  afterEach(() => {
    process.env.ADMIN_USER_IDS = saved;
  });

  const seed = (t: ReturnType<typeof convexTest>) =>
    t.run((ctx) => ctx.db.insert("projects", {
      title: "PGA Golf Game", description: "A golf game", category: "app",
      githubUrl: "https://github.com/chrislanejones/pga-golf-game",
      vercelUrl: "https://pga.example.com", featured: false, createdAt: 1, updatedAt: 1,
    }));

  test("an empty link removes it; other links stay", async () => {
    const t = convexTest(schema, modules);
    const id = await seed(t);
    await t.withIdentity({ subject: OWNER }).mutation(api.projects.update, { id, githubUrl: "", vercelUrl: "https://pga.example.com" });
    const project = await t.run((ctx) => ctx.db.get(id));
    expect(project?.githubUrl).toBeUndefined();
    expect(project?.vercelUrl).toBe("https://pga.example.com");
  });

  test("a new link replaces the old one", async () => {
    const t = convexTest(schema, modules);
    const id = await seed(t);
    await t.withIdentity({ subject: OWNER }).mutation(api.projects.update, { id, codebergUrl: "https://codeberg.org/chrislanejones/x" });
    const project = await t.run((ctx) => ctx.db.get(id));
    expect(project?.codebergUrl).toBe("https://codeberg.org/chrislanejones/x");
    expect(project?.githubUrl).toBe("https://github.com/chrislanejones/pga-golf-game");
  });

  test("only the owner can update", async () => {
    const t = convexTest(schema, modules);
    const id = await seed(t);
    await expect(t.mutation(api.projects.update, { id, githubUrl: "" })).rejects.toThrow();
  });
});
