/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");
const OWNER = "user_owner_test";
const PDF = "application/pdf";

describe("admin resume upload", () => {
  const saved = process.env.ADMIN_USER_IDS;
  beforeEach(() => {
    process.env.ADMIN_USER_IDS = OWNER;
  });
  afterEach(() => {
    process.env.ADMIN_USER_IDS = saved;
  });

  const store = (t: ReturnType<typeof convexTest>, type: string, bytes = 32) =>
    t.run((ctx) => ctx.storage.store(new Blob([new Uint8Array(bytes)], { type })));

  test("only the owner can get an upload URL or publish", async () => {
    const t = convexTest(schema, modules);
    const id = await store(t, PDF);
    await expect(t.mutation(api.resume.generateAdminUploadUrl, {})).rejects.toThrow();
    await expect(t.withIdentity({ subject: "user_someone_else" }).mutation(api.resume.publish, { kind: "pdf", storageId: id }))
      .rejects.toThrow();
    expect(await t.query(api.resume.getAdminStatus, {})).toEqual([]);
  });

  test("publishes a PDF, then replaces it and deletes the old blob", async () => {
    const t = convexTest(schema, modules);
    const owner = t.withIdentity({ subject: OWNER });
    const first = await store(t, PDF);
    await owner.mutation(api.resume.publish, { kind: "pdf", storageId: first });
    const second = await store(t, PDF, 64);
    await owner.mutation(api.resume.publish, { kind: "pdf", storageId: second });

    const status = await owner.query(api.resume.getAdminStatus, {});
    expect(status).toHaveLength(1);
    expect(status[0]).toMatchObject({ kind: "pdf", filename: "Chris_Lane_Jones_Resume.pdf", size: 64 });
    expect(await t.run((ctx) => ctx.db.system.get("_storage", first))).toBeNull();
    expect(await t.query(api.resume.getDownload, { kind: "pdf" })).toMatchObject({ filename: "Chris_Lane_Jones_Resume.pdf" });
  });

  test("rejects a file over 10 MB and actually deletes it", async () => {
    const t = convexTest(schema, modules);
    const owner = t.withIdentity({ subject: OWNER });
    const big = await store(t, PDF, 10 * 1024 * 1024 + 1);
    expect(await owner.mutation(api.resume.publish, { kind: "pdf", storageId: big })).toEqual({ error: "That file is over 10 MB." });
    // Returned, not thrown, so the delete commits.
    expect(await t.run((ctx) => ctx.db.system.get("_storage", big))).toBeNull();
    expect(await t.query(api.resume.getDownload, { kind: "pdf" })).toBeNull();
  });
});
