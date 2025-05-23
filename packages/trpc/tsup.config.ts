import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/root.ts", "src/trpc.ts"],
  outDir: "dist",
  platform: "node", // Auth logic is typically server-side or neutral
  format: ["esm"],
  dts: true, // tsup handles DTS
  external: [
    "@ai-sdk/anthropic",
    "@potential/auth",
    "@potential/consts",
    "@potential/db",
    "@potential/email",
    "@potential/env",
    "@potential/storage",
    "@potential/utils",
    "@potential/validators",
    "@trpc/server",
    "ai",
    "better-auth",
    "superjson",
    "zod",
  ],
  tsconfig: "tsconfig.json", // Explicitly point to tsconfig
  splitting: false, // Common for libraries
  sourcemap: true, // For JS sourcemaps by tsup
  clean: false, // Set to false
  bundle: true,
  // No onSuccess hook needed here, scripts will handle build sequence
});
