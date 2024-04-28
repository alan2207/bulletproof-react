export const initMocks = async () => {
  if (import.meta.env.VITE_APP_API_MOCKING === 'true') {
    console.log('API mocking enabled');
    const { worker } = await import('./browser');
    console.log('Starting worker');
    return worker.start();
  }
};
