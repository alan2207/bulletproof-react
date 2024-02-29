# 🗃️ State Management

There is no need to keep all of your state in a single centralized store. There are different needs for different types of state that can be split into several types:

## Component State

This is the state that only a component needs, and it is not meant to be shared anywhere else. But you can pass it as prop to children components if needed. Most of the time, you want to start from here and lift the state up if needed elsewhere. For this type of state, you will usually need:

- [useState](https://react.dev/reference/react/useState) - for simpler states that are independent
- [useReducer](https://react.dev/reference/react/useReducer) - for more complex states where on a single action you want to update several pieces of state

[Component State Example Code](../src/components/Layout/MainLayout.tsx)

## Application State

This is the state that controls interactive parts of an application. Opening modals, notifications, changing color mode, etc. For best performance and maintainability, keep the state as close as possible to the components that are using it. Don't make everything global out of the box.

Good Application State Solutions:

- [context](https://react.dev/learn/passing-data-deeply-with-context) + [hooks](https://react.dev/reference/react-dom/hooks)
- [redux](https://redux.js.org/) + [redux toolkit](https://redux-toolkit.js.org/)
- [mobx](https://mobx.js.org)
- [zustand](https://github.com/pmndrs/zustand)
- [constate](https://github.com/diegohaz/constate)
- [jotai](https://github.com/pmndrs/jotai)
- [recoil](https://recoiljs.org/)
- [xstate](https://xstate.js.org/)

[UI State Example Code](../src/stores/notifications.ts)

## Server Cache State

This is the state that comes from the server which is being cached on the client for further usage. It is possible to store remote data inside a state management store such as redux, but there are better solutions for that.

Good Server Cache Libraries:

- [react-query](https://react-query.tanstack.com/) - REST + GraphQL
- [swr](https://swr.vercel.app/) - REST + GraphQL
- [apollo client](https://www.apollographql.com/) - GraphQL
- [urql](https://formidable.com/open-source/urql/) - GraphQl

[Server State Example Code](../src/features/discussions/api/getDiscussions.ts)

## Form State

This is a state that tracks users inputs in a form.

Forms in React can be [controlled and uncontrolled](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).

Depending on the application needs, they might be pretty complex with many different fields which require validation.

Although it is possible to build any form using only React, there are pretty good solutions out there that help with handling forms such as:

- [React Hook Form](https://react-hook-form.com/)
- [Formik](https://formik.org/)
- [React Final Form](https://github.com/final-form/react-final-form)

Create abstracted `Form` component and all the input field components that wrap the library functionality and are adapted to the application needs. You can reuse it then throughout the application.

[Form Example Code](../src/components/Form/Form.tsx)

[Input Field Example Code](../src/components/Form/InputField.tsx)

You can also integrate validation libraries with the mentioned solutions to validate inputs on the client. Some good options are:

- [zod](https://github.com/colinhacks/zod)
- [yup](https://github.com/jquense/yup)

[Validation Example Code](../src/features/auth/components/RegisterForm.tsx)

## URL State

State that is being kept in the address bar of the browser. It is usually tracked via url params (`/app/${dynamicParam}`) or query params (`/app?dynamicParam=1`). It can be accessed and controlled via your routing solution such as `react-router-dom`.

[URL State Example Code](../src/features/discussions/routes/Discussion.tsx)
