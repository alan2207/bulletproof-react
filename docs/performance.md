# 🚄 Performance

### Code Splitting

Code splitting involves dividing production JavaScript into smaller files to optimize application loading times. This technique enables the application to be downloaded in parts, fetching only the necessary code when required.

Ideally, code splitting should be implemented at the routes level, ensuring that only essential code is loaded initially, with additional parts fetched lazily as needed. It's important to avoid excessive code splitting, as this can lead to a performance decline due to the increased number of requests required to fetch all the code chunks. Strategic code splitting, focusing on critical parts of the application, helps balance performance optimization with efficient resource loading.

[Code Splitting Example Code](../src/routes/index.tsx)

### Component and state optimizations

- Do not put everything in a single state. That might trigger unnecessary re-renders. Instead split the global state into multiple states according to where they are being used.

- Keep the state as close as possible to where it is being used. This will prevent re-rendering components that do not depend on the updated state.

- If you have a piece of state that is initialized by an expensive computation, use the state initializer function instead of executing it directly because the expensive function will be run only once as it is supposed to. e.g:

```javascript
// instead of this which would be executed on every re-render:
const [state, setState] = React.useState(myExpensiveFn());

// prefer this which is executed only once:
const [state, setState] = React.useState(() => myExpensiveFn());
```

- If you develop an application that requires a state to track many elements at once, you might consider state management libraries with atomic updates such as [jotai](https://jotai.pmnd.rs/).

- Use React Context wisely. React Context is good for low-velocity data like themes, user data, small local state etc. While dealing with medium-velocity/high-velocity data, you may consider using the [use-context-selector](https://github.com/dai-shi/use-context-selector) library that supports selectors (selectors are already built-in in most popular state management libraries like [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) or [jotai](https://jotai.org/)). Important to remember, context is often used as the "golden tool" for props drilling, whereas in many scenarios you may satisfy your needs by [lifting the state up](https://react.dev/learn/sharing-state-between-components#lifting-state-up-by-example) or [a proper composition of components](https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context). Do not rush with context and global state.

- If your application is expected to have frequent updates that might affect performance, consider switching from runtime styling solutions such as [emotion](https://emotion.sh/docs/introduction), [styled-components](https://styled-components.com/) that generate styles during runtime) to zero runtime styling solutions ([tailwind](https://tailwindcss.com/), [vanilla-extract](https://github.com/seek-oss/vanilla-extract), [CSS modules](https://github.com/css-modules/css-modules) which generate styles during build time).

### Children as the most basic optimization

- The `children` prop is the most basic and easiest way to optimize your components. When applied properly, it eliminates a lot of unnecessary rerenders. The JSX, passed in the form of `children` prop, represents an isolated VDOM structure that does not need (and cannot) be re-rendered by its parent. Example below:

```javascript
// Not optimized example
const App = () => <Counter />;

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <PureComponent /> // will rerender whenever "count" updates
    </div>
  );
};

const PureComponent = () => <p>Pure Component</p>;

// Optimized example
const App = () => (
  <Counter>
    <PureComponent />
  </Counter>
);

const Counter = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      {children} // won't rerender whenever "count" updates
    </div>
  );
};

const PureComponent = () => <p>Pure Component</p>;
```

### Image optimizations

Consider lazy loading images that are not in the viewport.

Use modern image formats such as WEBP for faster image loading.

Use `srcset` to load the most optimal image for the clients screen size.

### Web vitals

Since Google started taking web vitals in account when indexing websites, you should keep an eye on web vitals scores from [Lighthouse](https://web.dev/measure/) and [Pagespeed Insights](https://pagespeed.web.dev/).
