import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/emails/*.ts"],
  outDir: "dist",
  platform: "node",
  format: ["esm"],
  external: ["@potential/consts", "@potential/env", "dotenv"],
  dts: true, // Generate .d.ts files
  splitting: false, // Usually better for libraries, but can be true if preferred
  sourcemap: true,
  clean: true, // Clean output directory before build
  bundle: true, // Explicitly set, though often default
});
