/**
 * Single registry of every route in the app. Routes are declared once with a
 * `path` (for the router) and a `getHref()` (for links and redirects), so URLs
 * are never hand-assembled as strings elsewhere.
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
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
  },
} as const;
