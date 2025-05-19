import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  platform: "node", // Assuming env vars might be used server-side primarily
  format: ["esm"],
  external: ["@t3-oss/env-core", "zod"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
});
