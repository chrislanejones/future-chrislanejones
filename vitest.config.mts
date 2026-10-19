import { defineConfig } from "vitest/config";

export default defineConfig({
  // Match the "@/*" path alias in tsconfig.json.
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  test: {
    environment: "edge-runtime",
    include: ["convex/**/*.test.ts", "src/**/*.test.ts"],
    server: { deps: { inline: ["convex-test"] } },
  },
});
