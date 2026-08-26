/**
 * Single source of truth for every route in the app.
 *
 * Components link with `paths.tasks.getHref()` rather than a hand-written
 * string, so renaming a URL is a one-line change and TypeScript points at
 * every call site that needs new params.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  tasks: {
    path: '/tasks',
    getHref: () => '/tasks',
  },
  notFound: {
    path: '*',
    getHref: () => '/404',
  },
} as const;
