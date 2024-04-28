import '@testing-library/jest-dom/vitest';

import { resetDb } from '@/test/server/db';
import { server } from '@/test/server/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
beforeEach(() => {
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});
afterEach(() => {
  server.resetHandlers();
});

// general cleanup
afterEach(async () => {
  resetDb();
});
