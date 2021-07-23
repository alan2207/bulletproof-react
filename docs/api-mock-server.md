# API Mock Server

For prototyping the API use [mswjs](https://mswjs.io/), which is a great tool for quickly creating frontends without worrying about servers. It is not an actual backend, but a mocked server inside a service worker that intercepts all HTTP requests and returns desired responses based on the handlers you define. This is especially useful if you only have access to the frontend and are blocked by some not implemented features on the backend. This way, you will not be forced to wait for the feature to be completed or hardcode response data in the code, but use actual HTTP calls to build frontend features.

It can be used for designing API endpoints. The business logic of the mocked API can be created in its handlers.

[API Handlers Example Code](../src/test/server/handlers/auth.ts)

[Data Models Example Code](../src/test/server/db.ts)

Having fully functional mocked API server also handy when it comes to testing, you don't have to mock fetch, but make requests to the mocked server instead with the data your application would expect.
