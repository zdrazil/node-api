import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
// @ts-expect-error
import jest from 'eslint-plugin-jest';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import sortKeys from 'eslint-plugin-sort-keys-fix';
import sortTSKeys from 'eslint-plugin-typescript-sort-keys';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
        project: true,
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    name: 'base',
  },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{js,ts,mjs,tsx,jsx}'],
    name: 'all files',
    plugins: {
      'sort-destructure-keys': fixupPluginRules(sortDestructureKeys),
      'sort-keys-fix': fixupPluginRules(sortKeys),
      'typescript-sort-keys': fixupPluginRules(sortTSKeys),
    },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': false,
          'ts-expect-error': false,
          'ts-ignore': true,
          'ts-nocheck': true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowAny: false,
          allowNullableBoolean: false,
          allowNullableNumber: false,
          allowNullableObject: true,
          allowNullableString: false,
          allowNumber: false,
          allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          allowString: false,
        },
      ],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'import/extensions': 'off',
      'sort-destructure-keys/sort-destructure-keys': [
        'warn',
        { caseSensitive: false },
      ],
      'sort-keys-fix/sort-keys-fix': ['warn', 'asc', { caseSensitive: false }],
      'typescript-sort-keys/interface': [
        'warn',
        'asc',
        { caseSensitive: false },
      ],
      'typescript-sort-keys/string-enum': [
        'warn',
        'asc',
        { caseSensitive: false },
      ],
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  {
    files: ['**/*.spec.{js,ts,mjs}'],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ...jest.configs['flat/recommended'],
  },
  eslintConfigPrettier,
);
