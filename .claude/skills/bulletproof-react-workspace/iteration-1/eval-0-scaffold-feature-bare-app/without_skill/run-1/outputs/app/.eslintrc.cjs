/**
 * Architecture rules are enforced here, not just documented.
 *
 * Dependencies point in one direction only:
 *
 *   app  ->  features  ->  shared (components, hooks, lib, utils, types, config)
 *
 * Nothing points back up, and features never reach into each other.
 * Inside a feature use relative imports (`../api/get-tasks`); the `@/features/*`
 * alias is reserved for crossing a feature boundary from `src/app`.
 */
const noDirectAxios = {
  name: 'axios',
  message:
    'Use the shared client from @/lib/api-client so base URL, auth and error handling stay in one place.',
};

const sharedLayerRestrictions = {
  paths: [noDirectAxios],
  patterns: [
    {
      group: ['@/features/*', '@/features/*/**', '@/app/*', '@/app/*/**'],
      message:
        'Shared code must stay feature-agnostic. Move the shared piece down into src/components, src/hooks, src/lib or src/utils instead of importing a feature or the app shell.',
    },
  ],
};

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
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'no-restricted-imports': ['error', { paths: [noDirectAxios] }],
  },
  overrides: [
    {
      // A feature owns its slice and nothing else.
      files: ['src/features/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/features/*', '@/features/*/**'],
                message:
                  'Features must not import from other features. Use relative paths inside your own feature; if two features need the same thing, lift it into the shared layer or compose them in a route.',
              },
              {
                group: ['@/app/*', '@/app/*/**'],
                message:
                  'Features must not depend on the app shell. Dependencies point downwards: app -> features -> shared.',
              },
            ],
            paths: [noDirectAxios],
          },
        ],
      },
    },
    {
      files: [
        'src/components/**',
        'src/hooks/**',
        'src/lib/**',
        'src/utils/**',
        'src/types/**',
        'src/config/**',
      ],
      rules: {
        'no-restricted-imports': ['error', sharedLayerRestrictions],
      },
    },
    {
      // The one place allowed to talk to axios directly.
      files: ['src/lib/api-client.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          { patterns: sharedLayerRestrictions.patterns },
        ],
      },
    },
    {
      // Route modules intentionally export loaders/actions next to the
      // component, which fast refresh cannot verify.
      files: ['src/app/routes/**'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
    {
      files: ['*.cjs', 'vite.config.ts'],
      env: { node: true },
    },
  ],
};
