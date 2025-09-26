/**
 * ESLint Project Structure Configuration for Bulletproof React
 * 
 * This configuration enforces the bulletproof-react architecture patterns
 * using eslint-plugin-project-structure to ensure scalable folder organization,
 * prevent cross-feature imports, and maintain unidirectional data flow.
 * 
 * @see https://github.com/Igorkowalski94/eslint-plugin-project-structure
 * @see https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md
 */

module.exports = {
  folderStructure: {
    children: [
      {
        name: "apps",
        children: [
          {
            name: "*",
            children: [
              {
                name: "src",
                children: [
                  {
                    name: "app",
                    children: [
                      { name: "routes", children: [] },
                      { name: "app.tsx" },
                      { name: "provider.tsx" },
                      { name: "router.tsx" }
                    ]
                  },
                  { name: "assets", children: [] },
                  { name: "components", children: [] },
                  { name: "config", children: [] },
                  {
                    name: "features",
                    children: [
                      {
                        name: "*",
                        children: [
                          { name: "api", children: [] },
                          { name: "assets", children: [] },
                          { name: "components", children: [] },
                          { name: "hooks", children: [] },
                          { name: "stores", children: [] },
                          { name: "types", children: [] },
                          { name: "utils", children: [] }
                        ]
                      }
                    ]
                  },
                  { name: "hooks", children: [] },
                  { name: "lib", children: [] },
                  { name: "stores", children: [] },
                  { name: "testing", children: [] },
                  { name: "types", children: [] },
                  { name: "utils", children: [] }
                ]
              }
            ]
          }
        ]
      },
      { name: "docs", children: [] },
      { name: ".github", children: [] },
      { name: ".husky", children: [] },
      { name: "package.json" },
      { name: "README.md" },
      { name: "LICENSE" },
      { name: ".gitignore" },
      { name: ".project-structure.config.js" },
      { name: "eslint.config.js" }
    ]
  },

  independentModules: [
    {
      name: "Cross-feature import prevention",
      pattern: "apps/*/src/features/*/**",
      errorMessage: "Cross-feature imports are not allowed. Features should be independent modules.",
      allowImportsFrom: [
        "apps/*/src/components/**",
        "apps/*/src/hooks/**",
        "apps/*/src/lib/**",
        "apps/*/src/types/**",
        "apps/*/src/utils/**",
        "apps/*/src/config/**"
      ]
    },
    {
      name: "Shared modules independence",
      pattern: "apps/*/src/{components,hooks,lib,types,utils}/**",
      errorMessage: "Shared modules should not import from features or app layer.",
      allowImportsFrom: [
        "node_modules/**",
        "apps/*/src/types/**",
        "apps/*/src/config/**"
      ]
    },
    {
      name: "Features to app layer prevention",
      pattern: "apps/*/src/features/**",
      errorMessage: "Features should not import from the app layer.",
      disallowImportsFrom: [
        "apps/*/src/app/**"
      ]
    }
  ],

  fileComposition: {
    "**/*.{ts,tsx}": {
      allowedSelectors: [
        "interface",
        "type",
        "function",
        "arrowFunction",
        "class",
        "variable",
        "enum"
      ],
      rules: [
        {
          selector: "interface",
          positionIndex: 0,
          format: "PascalCase"
        },
        {
          selector: "type",
          positionIndex: 1,
          format: "PascalCase"
        },
        {
          selector: "function",
          format: "camelCase"
        },
        {
          selector: "arrowFunction",
          format: "camelCase"
        },
        {
          selector: "class",
          format: "PascalCase"
        }
      ]
    },
    "**/*.types.ts": {
      allowedSelectors: ["interface", "type", "enum"],
      maxSelectorsInRoot: {
        interface: 10,
        type: 10,
        enum: 5
      }
    },
    "**/*.test.{ts,tsx}": {
      allowedSelectors: ["function", "arrowFunction", "variable"],
      format: "camelCase"
    },
    "**/*.stories.{ts,tsx}": {
      allowedSelectors: ["variable", "arrowFunction", "function"],
      format: "camelCase"
    }
  },

  namingConventions: {
    "apps/*/src/components/**/*.tsx": {
      format: "PascalCase",
      allowedSuffixes: [".component.tsx", ".tsx"]
    },
    "apps/*/src/features/*/components/**/*.tsx": {
      format: "PascalCase",
      allowedSuffixes: [".component.tsx", ".tsx"]
    },
    "apps/*/src/**/*.types.ts": {
      format: "kebab-case",
      requiredSuffix: ".types.ts"
    },
    "apps/*/src/**/*.test.{ts,tsx}": {
      format: "kebab-case",
      requiredSuffix: ".test"
    },
    "apps/*/src/**/*.stories.{ts,tsx}": {
      format: "kebab-case",
      requiredSuffix: ".stories"
    },
    "apps/*/src/hooks/**/*.ts": {
      format: "camelCase",
      requiredPrefix: "use"
    }
  }
};
