import { Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '@/features/auth';

export const PublicOnlyRoutes = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthRoutes />} />
    </Routes>
  );
};
