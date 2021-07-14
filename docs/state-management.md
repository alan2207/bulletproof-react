# State Management

We can split state in several categories:

#### UI State

This is the state that controls interactive parts of an application. Opening modals, notifications, changing color mode, etc. For best performance and maintainability, keep the state as close as possible to the components that are using it. Don't make everything global out of the box.

Good UI State Libraries:

- [Context](https://reactjs.org/docs/context.html) + [hooks](https://reactjs.org/docs/hooks-intro.html)
- [zustand](https://github.com/pmndrs/zustand)
- [constate](https://github.com/diegohaz/constate)
- [redux](https://redux.js.org/)
- [mobx](https://mobx.js.org)
- [jotai](https://github.com/pmndrs/jotai)
- [recoil](https://recoiljs.org/)

[Example Code](../src/hooks/useNotificationStore.ts)

#### Server Cache State

This is the state that comes from the server which is being cached on the client for further usage. It is possible to store remote data inside a state management store such as redux, but there are better solutions for that.

Good Server Cache Libraries:

- [react-query](https://react-query.tanstack.com/) - REST + GraphQL
- [swr]() - REST + GraphQL
- [apollo client]() - GraphQL
- [urql]() - GraphQl

[Example Code](../src/features/discussions/hooks/useDiscussions.ts)

#### URL State

State that is being kept in the URL bar of the browser. Very useful for keeping pagination data of a list because even if the page gets refreshed, it will keep all the state in the URL bar so the user will see the same results.
