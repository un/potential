import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/button.tsx",
    "src/dropdown-menu.tsx",
    "src/form.tsx",
    "src/input.tsx",
    "src/label.tsx",
    "src/theme.tsx",
    "src/toast.tsx",
  ],
  outDir: "dist",
  platform: "browser",
  format: ["esm"],
  external: [
    "@hookform/resolvers",
    "@radix-ui/react-icons",
    "class-variance-authority",
    "next-themes",
    "radix-ui", // Or specific subpaths like "@radix-ui/react-slot" if used
    "react-hook-form",
    "sonner",
    "tailwind-merge",
    "react",
    "zod",
  ],
  dts: true,
  splitting: false, // Keep components bundled per entry point
  sourcemap: true,
  clean: true,
  bundle: true,
  // esbuildOptions(options) { // If Radix UI components need 'use client'
  //   options.banner = {
  //     js: '"use client";',
  //   };
  // },
});
