/**
 * Every route in the app, declared once.
 *
 * `path` is what the router registers; `getHref` is what links and redirects
 * call. Keeping both in one place means a URL change is a single edit, and the
 * API layer can redirect on 401 without hardcoding a string.
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
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },
} as const;
