/**
 * Every route in the app, in one place.
 *
 * `path` is what the router matches on; `getHref` is what you navigate to.
 * Keeping both here means a URL change is a single edit, and it lets non-router
 * code (like the 401 handler in the API client) redirect without hardcoding
 * strings.
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        }`,
    },
  },
} as const;
