import baseConfig from "@1up/eslint-config/base";
import reactConfig from "@1up/eslint-config/react";
import rnConfig from "@1up/eslint-config/rn";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...rnConfig,
];
