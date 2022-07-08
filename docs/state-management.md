# 🗃️ State Management

There is no need to keep all of your state in a single centralized store. At Yousign, we use what React gives us `useState` and `Context`, nothing more.

## Component State

This is the state that only a component needs, and it is not meant to be shared deep down the compontent tree. **Keep your state as close as possible to where its used**, and lift the state up if needed. For this type of state, you will need:

- [useState](https://reactjs.org/docs/hooks-reference.html#usestate) - for simpler states (i.e. primitive values)
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) - for more complex states where on a single action you want to update several pieces of state

[Component State Example Code](../src/components/Layout/MainLayout.tsx)

## UI Shared State

### Prop drilling

Many times you'll need to share the state to children. Keep it simple and pass is as a prop, as long as it does not break the separation of concerns. If the state pass through too many components create a Context.

### Context

If you need to shared state among severals components or pages (Application State), use React `Context`.  
A great use case for `Context`, it's when you want to make your component composable, and yet share the same state.

[context](https://reactjs.org/docs/context.html) + [hooks](https://reactjs.org/docs/hooks-intro.html)

[UI State Example Code](../src/stores/notifications.ts)

## Server Cache State

This is the state that comes from the server which is being cached on the client for further usage. This part is fully delegated to the beloved [react-query](https://react-query.tanstack.com/) library.

All you have to do is to define queries and invalidating them to refresh the data when needed.

[Server State Example Code](../src/features/discussions/api/getDiscussions.ts)

## Form State

This is a state that tracks users inputs in a form.

Use [React Hook Form](https://react-hook-form.com/) to handle the form state.  
To validate the form, create a schema using [yup](https://github.com/jquense/yup).

[Form Example Code](../src/components/Form/Form.tsx)

## URL State

State that is being kept in the address bar of the browser. It is usually tracked via url params (`/app/${dynamicParam}`) or query params (`/app?dynamicParam=1`). It can be accessed and controlled via `react-router-dom`.

Use `useLocation` and `useParams` to read the URL state, and `useHistory` to (re)write the URL state.

[URL State Example Code](../src/features/discussions/routes/Discussion.tsx)
