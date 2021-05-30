import React from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '@/features/auth';
import { AuthProvider, useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/react-query';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppRoutes = () => {
  const auth = useAuth();

  if (!auth.user) {
    return (
      <Routes>
        <Route path="/" element={<div>Index Page</div>} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    );
  }

  return <div>Hello World</div>;
};

const AppProvider = ({ children }: AppProviderProps) => {
  console.log(children);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
