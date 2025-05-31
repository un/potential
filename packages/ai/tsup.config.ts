import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts", "src/schema.ts"],
  outDir: "dist",
  platform: "node",
  format: ["esm"],
  external: [
    "@ai-sdk/openai",
    "@potential/db",
    "@potential/consts",
    "@potential/env",
    "@potential/templates",
    "@potential/utils",
    "ai",
    "zod",
  ],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  bundle: true,
});
