import { env } from '@/config/env';

import { initializeDb } from './db';

export const enableMocking = async () => {
  if (env.ENABLE_API_MOCKING) {
    const { worker } = await import('./browser');
    initializeDb();
    return worker.start();
  }
};
