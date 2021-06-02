import { Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '@/features/auth';

import { PublicRoutes } from './PublicRoutes';

export const PublicOnlyRoutes = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};
