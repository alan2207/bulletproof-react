import { AppProvider } from '@/app/provider';
import { AppRouter } from '@/app/router';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
