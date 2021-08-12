// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { queryClient } from '@/lib/react-query';
import { resetDb } from '@/test/server/db';
import { server } from '@/test/server/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// general cleanup
afterEach(async () => {
  queryClient.clear();
  resetDb();
});
