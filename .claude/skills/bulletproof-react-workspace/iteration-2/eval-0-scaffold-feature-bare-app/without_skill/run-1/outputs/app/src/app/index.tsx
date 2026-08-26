import { RouterProvider } from 'react-router';

import { AppProvider } from './provider';
import { createAppRouter } from './router';

const router = createAppRouter();

export const App = () => (
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
