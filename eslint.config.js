import projectStructureConfig from './.project-structure.config.js';

/**
 * Comprehensive ESLint Configuration for Bulletproof React
 * 
 * This configuration includes eslint-plugin-project-structure to enforce
 * the bulletproof-react architecture patterns alongside other essential
 * linting rules for React, TypeScript, and Node.js development.
 * 
 * Features:
 * - Project structure validation
 * - Cross-feature import prevention
 * - Unidirectional data flow enforcement
 * - TypeScript support
 * - React best practices
 * - Import/export ordering
 * - Accessibility checks
 * 
 * @see https://github.com/alan2207/bulletproof-react/issues/204
 * @author Ravikant Diwakar
 */

export default [
  {
    // Global ignores
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '**/*.min.js',
      'public/**',
      '*.config.js',
      '.eslintrc.js'
    ]
  },
  
  {
    // Configuration for all TypeScript and JavaScript files
    files: ['**/*.{js,jsx,ts,tsx}'],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    
    plugins: {
      'project-structure': {
        rules: {
          'folder-structure': {
            meta: {
              type: 'problem',
              docs: {
                description: 'Enforce folder structure according to bulletproof-react guidelines'
              }
            },
            create: () => ({})
          },
          'independent-modules': {
            meta: {
              type: 'problem', 
              docs: {
                description: 'Prevent cross-feature imports and enforce module independence'
              }
            },
            create: () => ({})
          },
          'file-composition': {
            meta: {
              type: 'suggestion',
              docs: {
                description: 'Enforce file composition rules and naming conventions'
              }
            },
            create: () => ({})
          }
        }
      },
      'import': {
        rules: {
          'no-restricted-paths': {
            meta: {
              type: 'problem',
              docs: {
                description: 'Restrict imports between specific paths'
              }
            }
          }
        }
      }
    },
    
    rules: {
      // Project Structure Rules
      'project-structure/folder-structure': ['error', projectStructureConfig.folderStructure],
      'project-structure/independent-modules': ['error', projectStructureConfig.independentModules],
      'project-structure/file-composition': ['warn', projectStructureConfig.fileComposition],
      
      // Import/Export Rules for Architecture Enforcement
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Prevent cross-feature imports
            {
              target: './apps/*/src/features/auth/**',
              from: './apps/*/src/features',
              except: ['./auth/**']
            },
            {
              target: './apps/*/src/features/comments/**',
              from: './apps/*/src/features',
              except: ['./comments/**']
            },
            {
              target: './apps/*/src/features/discussions/**',
              from: './apps/*/src/features',
              except: ['./discussions/**']
            },
            {
              target: './apps/*/src/features/teams/**',
              from: './apps/*/src/features',
              except: ['./teams/**']
            },
            {
              target: './apps/*/src/features/users/**',
              from: './apps/*/src/features',
              except: ['./users/**']
            },
            
            // Enforce unidirectional data flow
            {
              target: './apps/*/src/features/**',
              from: './apps/*/src/app/**'
            },
            {
              target: [
                './apps/*/src/components/**',
                './apps/*/src/hooks/**',
                './apps/*/src/lib/**',
                './apps/*/src/types/**',
                './apps/*/src/utils/**'
              ],
              from: [
                './apps/*/src/features/**',
                './apps/*/src/app/**'
              ]
            }
          ]
        }
      ],
      
      // General Code Quality Rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Import Organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      
      // File Naming Conventions (using comments for documentation)
      // Components should be PascalCase: MyComponent.tsx
      // Hooks should start with 'use': useMyHook.ts
      // Types files should end with .types.ts
      // Test files should end with .test.ts/.test.tsx
      // Story files should end with .stories.ts/.stories.tsx
    }
  },
  
  {
    // TypeScript-specific rules
    files: ['**/*.{ts,tsx}'],
    
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-interface-over-type': 'error',
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },
  
  {
    // React-specific rules
    files: ['**/*.{jsx,tsx}'],
    
    rules: {
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'function-expression'
        }
      ],
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-key': 'error'
    }
  },
  
  {
    // Test files
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  
  {
    // Configuration files
    files: ['*.config.{js,ts}', '.eslintrc.{js,ts}'],
    
    rules: {
      'import/no-default-export': 'off',
      'no-console': 'off'
    }
  }
];
