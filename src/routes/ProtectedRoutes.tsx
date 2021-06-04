import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { Landing } from '@/features/misc';

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/app" element={<App />}>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
};
