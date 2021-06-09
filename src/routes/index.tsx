import { useAuth } from '@/lib/auth';

import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRoutes = () => {
  const auth = useAuth();

  return auth.user ? <ProtectedRoutes /> : <PublicRoutes />;
};
