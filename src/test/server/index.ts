export const enableMocking = async () => {
  if (import.meta.env.VITE_APP_API_MOCKING === 'true') {
    const { worker } = await import('./browser');
    return worker.start();
  }
};
