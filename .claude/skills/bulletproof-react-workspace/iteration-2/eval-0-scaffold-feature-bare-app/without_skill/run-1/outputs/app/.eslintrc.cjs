/**
 * Architecture is enforced here, not just documented.
 *
 * Dependencies may only point in one direction:
 *
 *   shared (components, hooks, lib, utils, types, config)
 *        -> features/*
 *              -> app (routing + providers)
 *
 * - Shared code never imports a feature.
 * - Features never import from `app`.
 * - A feature is only reachable through its public API (`@/features/<name>`),
 *   never through its internals. Inside a feature, use relative imports.
 */

const featurePublicApiOnly = {
  group: ['@/features/*/*', '@/features/*/**'],
  message:
    'Import a feature through its public API ("@/features/tasks"), not its internals. Inside a feature, use relative imports.',
};

const noAppImports = {
  group: ['@/app', '@/app/*', '@/app/**'],
  message:
    'Only the app layer may import from "@/app". Dependencies point shared -> features -> app.',
};

const noFeatureImports = {
  group: ['@/features', '@/features/*', '@/features/**'],
  message:
    'Shared code must not depend on a feature. Move the reusable part into components/hooks/lib/utils instead.',
};

const restrict = (...patterns) => ['error', { patterns }];

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
    'no-restricted-imports': restrict(featurePublicApiOnly),
  },
  overrides: [
    {
      // Features may use shared code, but not each other's internals and not the app layer.
      files: ['src/features/**'],
      rules: {
        'no-restricted-imports': restrict(featurePublicApiOnly, noAppImports),
      },
    },
    {
      // Shared code sits at the bottom of the graph: it knows about nothing above it.
      files: [
        'src/components/**',
        'src/hooks/**',
        'src/lib/**',
        'src/utils/**',
        'src/types/**',
        'src/config/**',
      ],
      rules: {
        'no-restricted-imports': restrict(noAppImports, noFeatureImports),
      },
    },
    {
      // Barrel files re-export only; fast-refresh heuristics don't apply.
      files: ['src/**/index.ts'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
};
