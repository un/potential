import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  platform: "neutral", // Good for libraries usable in browser and node
  format: ["esm"],
  external: ["zod"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
});
