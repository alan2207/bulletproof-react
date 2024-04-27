export const initMocks = () => {
  if (process.env.VITE_API_MOCKING === 'true') {
    if (typeof window === 'undefined') {
      // TODO: Extract as separate script due to building commonjs error
      // Related issue: https://github.com/mswjs/msw/issues/2092
      // import('./server').then(({ server }) => server.listen());
    } else {
      import('./browser').then(({ worker }) => worker.start());
    }
  }
};
