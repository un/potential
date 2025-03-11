import baseConfig from '@1up/eslint-config/base';
import typeidConfig from '@1up/eslint-config/typeid';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**']
  },
  ...baseConfig,
  ...typeidConfig
];
