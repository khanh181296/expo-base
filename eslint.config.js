const { defineConfig, globalIgnores } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const simpleImportSort = require('eslint-plugin-simple-import-sort')
const globals = require('globals')

module.exports = defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'ios/*', 'android/*', 'coverage/*', 'expo-env.d.ts']),
  expoConfig,
  prettierRecommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'import/no-named-as-default-member': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../../*'], message: 'Use the `@/` alias instead of deep relative imports.' },
          ],
        },
      ],
    },
  },
  {
    files: ['*.config.js', 'env.js', '.lintstagedrc.js', 'scripts/**/*.js'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'jest.setup.ts'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Features expose a public API through their index file.
    files: ['src/app/**', 'src/components/**', 'src/lib/**', 'src/providers/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../../*'], message: 'Use the `@/` alias instead of deep relative imports.' },
            {
              group: ['@/features/*/*'],
              message: 'Import from the feature entry point, e.g. `@/features/auth`.',
            },
          ],
        },
      ],
    },
  },
])
