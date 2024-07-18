# ⚙️ Project Standards

Enforcing project standards is crucial for maintaining code quality, consistency, and scalability in a React application. By establishing and adhering to a set of best practices, developers can ensure that the codebase remains clean, organized, and easy to maintain.

#### ESLint

ESLint serves as a valuable linting tool for JavaScript, helping developers in maintaining code quality and adhering to coding standards. By configuring rules in the `.eslintrc.js` file, ESLint helps identify and prevent common errors, ensuring code correctness and promoting consistency throughout the codebase. This approach not only helps in catching mistakes early but also enforces uniformity in coding practices, thereby enhancing the overall quality and readability of the code.

[ESLint Configuration Example Code](../apps/react-vite/.eslintrc.cjs)

#### Prettier

Prettier is a useful tool for maintaining consistent code formatting in your project. By enabling the "format on save" feature in your IDE, code is automatically formatted according to the rules set in the `.prettierrc` configuration file. This practice ensures a uniform code style across your codebase and provides helpful feedback on code issues. If the auto-formatting fails, it signals potential syntax error. Furthermore, Prettier can be integrated with ESLint to handle code formatting tasks alongside enforcing coding standards effectively throughout the development process.

[Prettier Configuration Example Code](../apps/react-vite/.prettierrc)

#### TypeScript

ESLint is effective for detecting language-related bugs in JavaScript. However, due to JavaScript's dynamic nature, ESLint may not catch all runtime data issues, especially in complex projects. To address this, TypeScript is recommended. TypeScript is valuable for identifying issues during large refactoring processes that may go unnoticed. When refactoring, prioritize updating type declarations first, then resolving TypeScript errors throughout the project. It's important to note that while TypeScript enhances development confidence by performing type checking at build time, it does not prevent runtime failures. Here is a [great resource on using TypeScript with React](https://react-typescript-cheatsheet.netlify.app/).

#### Husky

Husky is a valuable tool for implementing and executing git hooks in your workflow. By utilizing Husky to run code validations before each commit, you can ensure that your code maintains high standards and that no faulty commits are pushed to the repository. Husky enables you to perform various tasks such as linting, code formatting, and type checking before allowing code pushes. You can check how to configure it [here](https://typicode.github.io/husky/#/?id=usage).

#### Absolute imports

Absolute imports should always be configured and used because it makes it easier to move files around and avoid messy import paths such as `../../../component`. Wherever you move the file, all the imports will remain intact. Here is how to configure it:

For JavaScript (`jsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

For TypeScript (`tsconfig.json`) projects:

```json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

It is also possible to define multiple paths for various folders(such as `@components`, `@hooks`, etc.), but using `@/*` works very well because it is short enough so there is no need to configure multiple paths and it differs from other dependency modules so there is no confusion in what comes from `node_modules` and what is our source folder. That means that anything in the `src` folder can be accessed via `@`, e.g some file that lives in `src/components/my-component` can be accessed using `@/components/my-component` instead of `../../../components/my-component`.

#### File naming conventions

We can also enforce the file naming conventions and folder naming conventions in the project. For example, you can enforce that all files should be named in `kebab-case`. This can help you to keep your codebase consistent and easier to navigate.

To enforce this, you can use ESLint:

```js
'check-file/filename-naming-convention': [
  'error',
  {
      '**/*.{ts,tsx}': 'KEBAB_CASE',
  },
  {
      // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
      ignoreMiddleExtensions: true,
  },
],
'check-file/folder-naming-convention': [
  'error',
  {
    // all folders within src (except __tests__)should be named in kebab-case
    'src/**/!(__tests__)': 'KEBAB_CASE',
  },
],
```
