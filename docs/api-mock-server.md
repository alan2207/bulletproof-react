# API Mock Server

#### msw.js

The backend API is built with mswjs, an amazing tool for quickly prototyping frontends without worrying about servers. It is not an actual backend, but a mocked server inside a service worker that intercepts all http requests and returns desired response based on the handlers we defined. Business logic can also be created in it's handlers. This is especially useful if you only have access to frontend and are blocked by some not implemented feature on the backend. This way you will not be forced to wait for the feature to be completed or harcode some objects or arrays in the code, but use actual http calls in order to build frontends.

This is also handy when it comes to testing, we don't have to mock fetch, but make requests to the mocked server with the data we expect.
