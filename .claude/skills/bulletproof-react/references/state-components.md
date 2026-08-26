# State Management & Component Patterns

## State categories in depth

Classify before choosing a tool. Most "state management problems" are misclassification — usually server cache treated as application state.

### Component state
`useState` for independent values; `useReducer` when one action updates several pieces at once. Start local, lift only when another component actually needs it. If a state initializer is expensive, pass a function so it runs once:

```js
// runs myExpensiveFn on every render:
const [state, setState] = React.useState(myExpensiveFn());
// runs it once:
const [state, setState] = React.useState(() => myExpensiveFn());
```

### Application state
Global UI concerns: notifications, modals, color mode. Keep it as close to its consumers as possible — don't globalize by default. Good options: context + hooks, zustand, jotai, redux-toolkit, mobx, xstate. The reference app uses a small zustand store for notifications (`components/ui/notifications/notifications-store.ts`).

React context is fine for low-velocity data (theme, user). For medium/high-velocity data prefer stores with selectors (zustand, jotai) or `use-context-selector` — plain context re-renders every consumer. Before adding context at all, try lifting state up or composition; context is not a props-drilling silver bullet.

If tracking many elements that update independently, consider atomic-update stores (jotai).

### Server cache state
react-query (or swr; apollo/urql for GraphQL; RTK Query). Never mirror fetched data into redux/zustand — the cache library already handles staleness, deduplication, and invalidation, and a mirror will drift. All server-cache access goes through the feature's `api/` hooks (see SKILL.md API layer).

### Form state
react-hook-form + zod (formik / final-form also viable). Wrap the library in an app-level `Form` abstraction plus field components (`components/ui/form/`), so the app depends on your API, not the library's — swapping or upgrading the form library later touches one folder. The zod schema comes from the feature's API mutation file, so client validation and request validation stay in sync:

```tsx
<Form
  id="create-discussion"
  onSubmit={(values) => createDiscussionMutation.mutate({ data: values })}
  schema={createDiscussionInputSchema}
>
  {({ register, formState }) => (
    <>
      <Input
        label="Title"
        error={formState.errors['title']}
        registration={register('title')}
      />
      <Textarea
        label="Body"
        error={formState.errors['body']}
        registration={register('body')}
      />
    </>
  )}
</Form>
```

### URL state
Page numbers, selected ids, filters — anything shareable/bookmarkable belongs in the URL (params or query string), read via the router (`useParams`, `useSearchParams`). Don't shadow it in component state.

## Component best practices

- **Colocate everything** — components, styles, state, helpers live next to their usage. Improves readability and cuts redundant re-renders.
- **No nested render functions.** A `renderItems()` inside a component is a component that wasn't extracted. Extract it:

  ```jsx
  // hard to maintain as the component grows
  function Component() {
    function renderItems() {
      return <ul>...</ul>;
    }
    return <div>{renderItems()}</div>;
  }

  // extract as a component
  function Items() {
    return <ul>...</ul>;
  }
  ```

- **Limit props; prefer composition.** Too many props = split the component or accept `children`/slots (see `confirmation-dialog` in the reference app: trigger button, title, body, confirm button are composed, not configured).
- **`children` is the cheapest render optimization.** JSX passed as `children` is not re-rendered when the parent's own state changes — often removes the need for `memo`:

  ```jsx
  // PureComponent re-renders on every count change:
  const Counter = () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <PureComponent />
      </div>
    );
  };

  // passed as children, it doesn't:
  const App = () => (
    <Counter>
      <PureComponent />
    </Counter>
  );
  ```

- **Abstract shared components into `components/ui/`** once repetition is real (wrong abstractions are worse than duplication). Wrap 3rd-party components (link, dialog, etc.) so app code depends on your interface and swaps stay cheap. The reference app ships a plop generator (`yarn generate`) that scaffolds a shared ui component with its stories file — shared `ui/*` folders may carry a small `index.ts`; feature modules never do.
- **Stay consistent** — the linter enforces naming and import order; don't fight it.

## Styling

Zero-runtime solutions (tailwind, vanilla-extract, CSS modules, Panda) preferred over runtime CSS-in-JS (emotion, styled-components), especially for frequently-updating apps and anything that might adopt React Server Components. The reference app uses tailwind + a `cn()` helper (clsx + tailwind-merge).

Component library tiers, when not building from scratch:
- Fully styled: Chakra, MUI, Mantine, AntD.
- Headless (bring your own styles): Radix, Base UI, Headless UI, react-aria, Ark.
- Copy-in code: shadcn/ui, Park UI — components you own and edit.

Storybook for developing and cataloguing shared components in isolation.

## Performance extras

- Split global state into multiple stores by consumer; don't create one mega-store.
- Route-level code splitting only (see app-setup.md); over-splitting adds request overhead.
- Lazy-load below-the-fold images; use WEBP and `srcset`.
- Watch Lighthouse / Pagespeed web vitals.
- Prefetch data for likely navigation via `queryClient.prefetchQuery` (e.g. on hover of a list row).
