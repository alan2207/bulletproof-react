export const initMocks = () => {
  if (process.env.VITE_API_MOCKING === 'true') {
    if (typeof window === 'undefined') {
      import('./server').then(({ server }) => server.listen());
    } else {
      import('./browser').then(({ worker }) => worker.start());
    }
  }
};
