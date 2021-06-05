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
    path: '/app',
    goTo: () => '/app',
  },
  team: {
    path: '/app/team',
    goTo: () => '/app/team',
  },
  profile: {
    path: '/app/profile',
    goTo: () => '/app/profile',
  },
  discussions: {
    path: '/app/discussions',
    goTo: () => '/app/discussions',
  },
  discussionDetails: {
    path: '/app/discussions/:discussionId',
    goTo: ({ discussionId }: { discussionId: string }) => `/app/discussions/${discussionId}`,
  },
  createDiscussion: {
    path: '/app/discussions/create',
    goTo: () => '/app/discussions/create',
  },
};
