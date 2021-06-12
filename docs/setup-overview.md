# Setup Overview

The application has been bootstraped using `Create React App` for simplicity reasons. It allows us to create applications quickly without dealing with complex tooling setup such as bundling, transpiling etc.

For static analysis and code quality we are using ESLint, Prettier, TypeScript and Husky.

### ESLint

By providing specific rules defined in `.eslintrc.js` we are making sure that any problem we might have during development wil be quickly spotted.

### Prettier

This is another great tool. By utilising "format on save" feature in our IDE we can automatically format code based on the configuration provided in the `.prettierrc` file. It also gives us a good feedback when something is wrong with the code. If it doesn't auto-format we know something is wrong with it.

### TypeScript

Since JavaScript is a dynamic language, this can often lead to many bugs, especially on larger projects. That is why TypeScript should be used. It is very useful during large refactors because it reports to us any issues we might have missed otherwise. One thing we should keep in mind is that only does it during build time, runtime errors can still occur.

### Husky

We use Husky to run code checking before every commit, thus making sure our code is in the best shape possible at any point of time. So we will run linting, prettifying and type checking before we push our code.

### msw.js

The backend API is built with mswjs, an amazing tool for quickly prototyping frontends without worrying about servers. It is not an actual backend, but a mocked server inside a service worker that intercepts all http requests and returns desired response based on the handlers we defined. This is especially useful if you only have access to frontend and are blocked by some not implemented feature on the backend. This way you will not be forced to wait for the feature to be completed or harcode some objects or arrays in the code, but use actual http calls.

This is also handy when it comes to testing, we don't have to mock fetch, but make requests to the mocked server.
