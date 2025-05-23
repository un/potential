import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/typeid.ts",
    "src/ms.ts",
    "src/convert.ts",
    "src/uiColors.ts",
    "src/storage.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false, // Recommended for packages to avoid chunks
  sourcemap: true,
  clean: false,
  treeshake: true,
  external: [
    "@potential/tsconfig",
    "convert-units",
    "itty-time",
    "nanoid",
    "typeid-js",
    "zod",
  ],
});
