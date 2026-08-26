module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Configuration has exactly one entry point. Reading `import.meta.env`
    // directly skips validation and defaults, which is how a missing variable
    // turns into a mysterious `undefined` at runtime.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MemberExpression[object.type="MetaProperty"][property.name="env"]',
        message:
          'Import the validated `env` object from `@/config/env` instead of reading `import.meta.env` directly.',
      },
    ],
  },
  overrides: [
    {
      // The one module allowed to read the raw environment.
      files: ['src/config/env.ts', 'vite.config.ts'],
      rules: { 'no-restricted-syntax': 'off' },
    },
  ],
};
