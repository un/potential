import baseConfig from '@1up/eslint-config/base';
import ownerIdColumnRule from '@1up/eslint-config/owneridcolumn';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**']
  },
  ...baseConfig,
  ...ownerIdColumnRule
];
