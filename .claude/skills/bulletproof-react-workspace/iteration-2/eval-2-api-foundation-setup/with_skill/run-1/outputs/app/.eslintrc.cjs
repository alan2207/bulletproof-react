module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'check-file'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // --- Module boundaries -------------------------------------------------
    // This is what turns the architecture into enforcement rather than
    // convention. EVERY new feature must be added to the cross-feature block
    // below, otherwise it is silently unprotected.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Disable cross-feature imports.
          // One entry per feature, e.g.:
          // {
          //   target: './src/features/discussions',
          //   from: './src/features',
          //   except: ['./discussions'],
          // },

          // Enforce a unidirectional codebase: src/app can import from
          // src/features, but not the other way around.
          {
            target: './src/features',
            from: './src/app',
          },
          // Shared modules may not import from features or app.
          {
            target: [
              './src/components',
              './src/hooks',
              './src/lib',
              './src/types',
              './src/utils',
            ],
            from: ['./src/features', './src/app'],
          },
        ],
      },
    ],
    'import/no-cycle': 'error',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // --- Naming ------------------------------------------------------------
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
  },
  overrides: [
    {
      plugins: ['check-file'],
      files: ['src/**/!(__tests__)/*'],
      rules: {
        'check-file/folder-naming-convention': [
          'error',
          { '**/*': 'KEBAB_CASE' },
        ],
      },
    },
  ],
};
