import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["api/index.ts"],
  outDir: ".output",
  format: "esm",
  target: "esnext",
  clean: true,
  bundle: true,
  treeshake: true,
  noExternal: [/^@potential\/.*/],
  minify: false,
  keepNames: true,
  banner: {
    js: [
      `import { createRequire } from 'module';`,
      `const require = createRequire(import.meta.url);`,
    ].join("\n"),
  },
  esbuildOptions: (options) => {
    options.legalComments = "none";
  },
});
