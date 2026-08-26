/**
 * Single source of truth for URLs.
 *
 * `path` is what the router registers, `getHref` is what links call. Keeping
 * both here means a route can be renamed without grepping for string literals.
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
} as const;
