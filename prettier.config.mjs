const sqlSettings = {
  dataTypeCase: 'upper',
  embeddedSqlTags: ['sql'],
  expressionWidth: 150,
  functionCase: 'lower',
  keywordCase: 'upper',
  language: 'postgresql',
};

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
    'prettier-plugin-sql',
    'prettier-plugin-embed',
    'prettier-plugin-packagejson',
  ],
  ...sqlSettings,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
};

export default config;
