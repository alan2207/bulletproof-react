# Setup Overview

The application has been bootstraped using `Create React App` for simplicity reasons. It allows us to create applications quickly without dealing with complex tooling setup such as bundling, transpiling etc.

For static analysis and code quality we are using ESLint, Prettier, TypeScript and Husky.

## Code Quality:

Here are some of static analysis tools used in the app:

#### ESLint

ESLint is a linting tool for JavaScript. By providing specific configuration defined in the`.eslintrc.js` file it prevents developers from making silly mistakes in their code and enforces consistency in the codebase.

#### Prettier

This is a great tool for formatting code. By utilising "format on save" feature in our IDE we can automatically format code based on the configuration provided in the `.prettierrc` file. It also gives us a good feedback when something is wrong with the code. If it doesn't auto-format we know something is wrong with the code.

#### TypeScript

ESLint is great for catching some of the bugs related to the language, but since JavaScript is a dynamic language ESLint cannot check data that runs through the applications, which can often lead to bugs, especially on larger projects. That is why TypeScript should be used. It is very useful during large refactors because it reports any issues we might have missed otherwise. One thing we should keep in mind is that only does it during build time, runtime errors can still occur, but it increases development confidence drastically.

#### Husky

We use Husky to run code checking before every commit, thus making sure our code is in the best shape possible at any point of time and no faulty commits get in the repo. So we will run linting, prettifying and type checking before we push our code.

## Server

Usually the application is communicating with an external server API, however, in this app everything is mocked.

#### msw.js

The backend API is built with mswjs, an amazing tool for quickly prototyping frontends without worrying about servers. It is not an actual backend, but a mocked server inside a service worker that intercepts all http requests and returns desired response based on the handlers we defined. Business logic can also be created in it's handlers. This is especially useful if you only have access to frontend and are blocked by some not implemented feature on the backend. This way you will not be forced to wait for the feature to be completed or harcode some objects or arrays in the code, but use actual http calls in order to build frontends.

This is also handy when it comes to testing, we don't have to mock fetch, but make requests to the mocked server with the data we expect.
