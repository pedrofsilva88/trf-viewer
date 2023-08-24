/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    root: true,
    settings: {
        react: { version: "detect" }
    }
};