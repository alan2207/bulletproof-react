/**
 * Single registry of every route in the app.
 *
 * Each entry declares a `path` (consumed by the router) and a `getHref()`
 * (consumed by links and redirects) so URLs are never hand-assembled as
 * strings at call sites. Every new feature adds its routes here.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    // Feature routes are registered here, e.g.
    // discussions: { path: 'discussions', getHref: () => '/app/discussions' },
  },
} as const;
