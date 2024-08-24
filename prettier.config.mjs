/**
 * @type {import('prettier').Config}
 * @see https://prettier.io/docs/en/configuration.html
 */
const config = {
  cssDeclarationSorterKeepOverrides: false,
  cssDeclarationSorterOrder: 'alphabetical',
  htmlWhitespaceSensitivity: 'strict',
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-jsdoc',
    'prettier-plugin-packagejson',
  ],
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
};

export default config;
