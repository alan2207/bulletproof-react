export const RoutesConfig = {
  index: {
    path: '/',
    goTo: () => '/',
  },
  login: {
    path: '/auth/login',
    goTo: () => '/auth/login',
  },
  register: {
    path: '/auth/register',
    goTo: () => '/auth/register',
  },
  dashboard: {
    path: '/dashboard',
    goTo: () => '/dashboard',
  },
  team: {
    path: '/team',
    goTo: () => '/team',
  },
  profile: {
    path: '/profile',
    goTo: () => '/profile',
  },
  discussions: {
    path: '/discussions',
    goTo: () => '/discussions',
  },
  discussionDetails: {
    path: '/discussions/:discussionId',
    goTo: ({ discussionId }: { discussionId: string }) => `/discussions/${discussionId}`,
  },
  createDiscussion: {
    path: '/discussions/create',
    goTo: () => '/discussions/create',
  },
};
