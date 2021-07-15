# Performance

### Code Splitting

Code splitting is a technique of splitting production chunks into smaller pieces, thus allowing the application to be only partially downloaded. Any unused code will not be downloaded until it is required by the application.

Most of the time code splitting should be done on the routes level.

Do not code split everything as it might even worsen your application's performance.

[Code Splitting Example Code](../src/routes/index.tsx)

### Component and state optimizations

- Do not put everything in a single context. That might trigger unnecessary re-renders. Instead split the global state into multiple contexts.

- Keep the state as close as possible to where it is being used. This will prevent re-rendering components that do not depend on the updated state.

- If you have a piece of state that is initialized by an expensive computation, use the state initializer function instead of executing it directly because the expensive function will be run only once as it is supposed to. e.g:

```javascript
// instead of this which would be executed on every re-render:
const [state, setState] = React.useState(myExpensiveFn());

// prefer this which is executed only once:
const [state, setState] = React.useState(() => myExpensiveFn());
```

- If you develop an application that requires the state to track many elements at once, you might consider state management libraries with atomic updates such as [recoil](https://recoiljs.org/) or [jotai](https://jotai.pmnd.rs/).

- If your application is expected to have frequent updates that might affect performance, consider switching from runtime styling solutions ([Chakra UI](https://chakra-ui.com/), [emotion](https://emotion.sh/docs/introduction), [styled-components](https://styled-components.com/) that generate styles during runtime) to zero runtime styling solutions ([tailwind](https://tailwindcss.com/), [linaria](https://github.com/callstack/linaria), [vanilla-extract](https://github.com/seek-oss/vanilla-extract), [CSS modules](https://github.com/css-modules/css-modules) which generate styles during build time).

### Image optimizations

Consider lazy loading images that are not in the viewport.

Use modern image formats such as WEBP for faster image loading.

### Web vitals

Since Google started taking web vitals in account when indexing websites, you should keep an eye on web vitals scores from [Lighthouse](https://web.dev/measure/) and [Pagespeed Insights](https://developers.google.com/speed/pagespeed/insights/).

### Deployment

Deploy and serve your application and assets over a CDN. Good options for that are:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [AWS](https://aws.amazon.com/cloudfront/)
- [CloudFlare](https://www.cloudflare.com/en-gb/cdn/)
