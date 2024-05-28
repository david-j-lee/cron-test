module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:all', 'preact', 'prettier'],
  overrides: [
    {
      files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'max-lines': 0,
    'max-statements': ['error', 15],
    'no-continue': 'off',
    'no-magic-numbers': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-ternary': 'off',
    'no-unused-vars': 'off',
    'no-var': 'error',
    'one-var': 'off',
    'sort-imports': 'off',
  },
}
