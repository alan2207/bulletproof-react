# Testing

This [tweet](https://twitter.com/rauchg/status/807626710350839808) explains in a concise way how to think about testing. You will get the most benefit from having integration and e2e tests. Unit tests are fine, but they wouldn't give you as much confidence that your application is working as integration tests do.

### Types of tests:

#### Unit Tests

Unit testing, as the naming already reveals is a type of testing where a unit of the application is being tested in isolation.
Write unit tests for shared components and functions that are used throughout the entire application as they might be used in different scenarios which might be difficult to reproduce in the integration tests.

[Unit Test Example Code](../src/components/Elements/ConfirmationDialog/__tests__/ConfirmationDialog.test.tsx)

#### Integration Tests

Integration testing is a method of testing multiple parts of the application at once.
Most of your tests should be integration tests, as these will give you the most benefits and confidence for your invested effort. Unit tests on their own don't guarantee that your app will work even if those tests pass, because the relationship between the units might be wrong. You should test different features with integration tests.

[Integration Test Example Code](../src/features/auth/components/__tests__/RegisterForm.test.tsx)

#### E2E

End-To-End Testing is a testing method where the application is tested as a complete entity.
Usually these tests consist of running the entire application with the frontend and the backend in an automated way and verifying that the entire system works. It is usually written in the way the application should be used by the user.

[E2E Example Code](../cypress/integration/smoke.ts)

### Tooling:

#### [Jest](https://jestjs.io/)

Jest is a fully featured testing framework and is the de-facto standard when it comes to testing JavaScript applications. It is very flexible and configurable to test both frontends and backends.

#### [Testing Library](https://testing-library.com/)

Testing library is a set of libraries and tools that makes testing easier than ever before. Its philosophy is to test your app in a way it is being used by a real world user instead of testing implementation details. For example, don't test what is the current state value in a component, but test what that component renders on the screen for the user. If you refactor your app to use a different state management solution, the tests will still be relevant as the actual component output to the user didn't change.

#### [Cypress](https://www.cypress.io/)

Cypress is a tool for running e2e tests in an automated way.
You define all the commands a real world user would execute when using the app and then start the test. It can be started in 2 modes:

- Browser mode - it will start a dedicated browser and run your application from start to finish. You get a nice set of tools to visualize and inspect your application on each step. Since this is a more expensive option, you want to run it only locally when developing the application.
- Headless mode - it will start a headless browser and run your application. Very useful for integrating with CI/CD to run it on every deploy.

It is very configurable with plugins and commands. You can even pair it with [Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/) which is makes your tests even easier to write.

You can also write custom commands to abstract some common tasks.

[Custom Cypress Commands Example Code](../cypress/support/commands.ts)
