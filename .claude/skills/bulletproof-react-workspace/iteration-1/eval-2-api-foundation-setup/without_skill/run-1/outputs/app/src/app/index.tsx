import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
);
