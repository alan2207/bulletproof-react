/**
 * Single source of truth for every route in the app.
 *
 * `path` is what the router registers, `getHref()` is what links use — so no
 * URL is ever hand-assembled as a string elsewhere in the codebase.
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
