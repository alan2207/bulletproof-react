export const initMocks = () => {
  if (process.env.REACT_APP_API_MOCKING === 'true') {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { server } = require('./server');
      server.listen();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { worker } = require('./browser');
      worker.start();
    }
  }
};
