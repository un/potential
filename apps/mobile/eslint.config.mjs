import baseConfig from "@potential/eslint-config/base";
import reactConfig from "@potential/eslint-config/react";
import rnConfig from "@potential/eslint-config/rn";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...rnConfig,
];
