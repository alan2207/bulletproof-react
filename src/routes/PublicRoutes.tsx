import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthRoutes } from '@/features/auth';
import { Landing } from '@/features/misc';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
