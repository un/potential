import baseConfig, { restrictEnvAccess } from "@potential/eslint-config/base";
import nextjsConfig from "@potential/eslint-config/nextjs";
import reactConfig from "@potential/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
