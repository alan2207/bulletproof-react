import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@/components/Layout';
import { DiscussionsRoutes } from '@/features/discussions';
import { Landing, Dashboard } from '@/features/misc';

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
        <Route path="/discussions/*" element={<DiscussionsRoutes />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
};
