import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/schema.ts"],
  outDir: "dist",
  platform: "node",
  format: ["esm"],
  external: [
    "drizzle-orm",
    "drizzle-zod",
    "@planetscale/database",
    "@potential/consts",
    "@potential/env",
    "@potential/utils",
    "zod",
  ],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
});
