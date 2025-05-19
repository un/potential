import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "@potential/consts",
    "@potential/utils",
    "@potential/tsconfig", // Added as it's a devDependency that might be used by tsconfig.json
    "zod",
  ],
});
