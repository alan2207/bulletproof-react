// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      checkAndDismissNotification: (matcher: RegExp | string) => void;
    }
  }
}

export {};
