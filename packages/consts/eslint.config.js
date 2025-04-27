import baseConfig from "@potential/eslint-config/base";
import typeidConfig from "@potential/eslint-config/typeid";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...typeidConfig,
];
