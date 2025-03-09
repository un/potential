import baseConfig, { restrictEnvAccess } from "@1up/eslint-config/base";
import nextjsConfig from "@1up/eslint-config/nextjs";
import reactConfig from "@1up/eslint-config/react";

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
