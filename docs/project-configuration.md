# Project Configuration

The application has been bootstraped using `Create React App` for simplicity reasons. It allows us to create applications quickly without dealing with a complex tooling setup such as bundling, transpiling etc.

You should always configure and use the following tools:

#### ESLint

ESLint is a linting tool for JavaScript. By providing specific configuration defined in the`.eslintrc.js` file it prevents developers from making silly mistakes in their code and enforces consistency in the codebase.

[ESLint Configuration Example Code](../.eslintrc.js)

#### Prettier

This is a great tool for formatting code. By utilising "format on save" feature in our IDE you can automatically format the code based on the configuration provided in the `.prettierrc` file. It also gives us a good feedback when something is wrong with the code. If it doesn't auto-format, something is wrong with the code.

[Prettier Configuration Example Code](../.prettierrc)

#### TypeScript

ESLint is great for catching some of the bugs related to the language, but since JavaScript is a dynamic language ESLint cannot check data that runs through the applications, which can lead to bugs, especially on larger projects. That is why TypeScript should be used. It is very useful during large refactors because it reports any issues we might have missed otherwise. When refactoring, change the type declaration first, then fix the TS errors throughout the project and you are done. One thing you should keep in mind is that ts only does type checking during the build time, runtime errors can still occur, but it increases development confidence drastically anyways.

#### Husky

Use Husky to run your code checking before every commit, thus making sure the code is in the best shape possible at any point of time and no faulty commits get in the repo. It will run linting, prettifying and type checking before it allows pushing the code.

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

[Paths Configuration Example Code](../tsconfig.paths.json)

In this project we have to create another tsconfig file `tsconfig.paths.json` where we configure this and merge it with the base configuration, because CRA will override it otherwise.

It is also possible to define multiple paths for various folders, but using `@/*` works very good because it is short enough so there is no need to configure multiple paths and it differs from other modules so there is no confusion in what comes from `node_modules` and what is our source files. That means that anything in the `src` folder can be accessed via `@`, e.g some file that lives in `src/components/MyComponent` can be accessed using `@/components/MyComponents`.
