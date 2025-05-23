import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/emails/*.ts"],
  outDir: "dist",
  platform: "node",
  format: ["esm"],
  external: [
    "@potential/consts",
    "@potential/env",
    "@react-email/components",
    "dotenv",
    "react",
    "react-dom",
    "resend",
  ],
  dts: true, // Generate .d.ts files
  splitting: false, // Usually better for libraries, but can be true if preferred
  sourcemap: true,
  clean: false, // Clean output directory before build
  bundle: true, // Explicitly set, though often default
});
