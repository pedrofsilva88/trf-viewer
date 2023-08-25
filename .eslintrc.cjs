/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks', 'react-refresh'],
  root: true,
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
}
