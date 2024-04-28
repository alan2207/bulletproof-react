import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // The setupNodeEvents function allows you to tap into, modify, or extend the internal behavior of Cypress.
      //
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      //
      // If you come from a Cypress version <10, this can be considered as an equivalent to the `plugins/index.ts` file.
    },
  },
});
