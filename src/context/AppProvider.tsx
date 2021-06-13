import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';

import { Notifications } from '@/components/Notifications/Notifications';
import { AuthProvider } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Notifications />
      <AuthProvider>
        <Router>{children}</Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
