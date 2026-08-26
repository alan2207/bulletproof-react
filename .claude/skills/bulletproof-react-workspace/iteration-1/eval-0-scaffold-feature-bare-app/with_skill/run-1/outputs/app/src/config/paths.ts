/**
 * Single registry of every route in the app.
 *
 * `path` is what the router mounts, `getHref()` is what links call — so URLs
 * are never hand-assembled as strings anywhere else in the codebase.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    tasks: {
      path: 'tasks',
      getHref: () => '/app/tasks',
    },
  },
} as const;
