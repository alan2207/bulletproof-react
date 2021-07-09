# Setup Overview

The application has been bootstraped using `Create React App` for simplicity reasons. It allows us to create applications quickly without dealing with complex tooling setup such as bundling, transpiling etc.

#### ESLint

ESLint is a linting tool for JavaScript. By providing specific configuration defined in the`.eslintrc.js` file it prevents developers from making silly mistakes in their code and enforces consistency in the codebase.

#### Prettier

This is a great tool for formatting code. By utilising "format on save" feature in our IDE we can automatically format code based on the configuration provided in the `.prettierrc` file. It also gives us a good feedback when something is wrong with the code. If it doesn't auto-format we know something is wrong with the code.

#### TypeScript

ESLint is great for catching some of the bugs related to the language, but since JavaScript is a dynamic language ESLint cannot check data that runs through the applications, which can often lead to bugs, especially on larger projects. That is why TypeScript should be used. It is very useful during large refactors because it reports any issues we might have missed otherwise. One thing we should keep in mind is that only does it during build time, runtime errors can still occur, but it increases development confidence drastically.

#### Husky

We use Husky to run code checking before every commit, thus making sure our code is in the best shape possible at any point of time and no faulty commits get in the repo. So we will run linting, prettifying and type checking before we push our code.

Usually the application is communicating with an external server API, however, in this app everything is mocked.

#### Absolute imports

Absolute imports should always be configured and used because it makes it easier to move files around and avoid messy import paths such as `../../../Component`. Wherever you move the file, all the imports will remain intact. Here is how to configure it:

For JavaScript projects:

```
// jsconfig.json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

For TypeScript projects:

```
// tsconfig.json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
```

In this project we have to create another tsconfig file `tsconfig.paths.json` where we configure this and merge it with the base configuration, because CRA will override it otherwise.

It is also possible to define multiple paths for various folders, but using `@/*` works very good because it is short enough so there is no need to configure multiple paths and it differs from other modules so there is no confusion in what comes from `node_modules` and what is our source files. That means that anything in the `src` folder can be accessed via `@`, e.g some file that lives in `src/components/MyComponent` can be accessed using `@/components/MyComponents`.
