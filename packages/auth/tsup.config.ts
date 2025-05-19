import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  platform: "node", // Auth logic is typically server-side or neutral
  format: ["esm"],
  external: [
    "@better-auth/expo",
    "@potential/consts",
    "@potential/db",
    "@potential/email",
    "@potential/env",
    "@potential/utils",
    "@potential/validators",
    "better-auth",
    "dotenv",
    "zod",
  ],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  minify: false,
  treeshake: true,
});
