import baseConfig from "@potential/eslint-config/base";
import ownerIdColumnRule from "@potential/eslint-config/owneridcolumn";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...ownerIdColumnRule,
];
