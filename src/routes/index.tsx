import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@/lib/auth';

import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicOnlyRoutes } from './PublicOnlyRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRoutes = () => {
  const auth = useAuth();

  console.log(auth);

  if (!auth.user) {
    return (
      <Routes>
        <Route path="*" element={<PublicOnlyRoutes />} />
        {/* <Route path="/*" element={<PublicRoutes />} /> */}
      </Routes>
    );
  }

  return (
    <Routes>
      <PublicRoutes />
      <ProtectedRoutes />
    </Routes>
  );
};
