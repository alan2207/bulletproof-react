import { useAuth } from '@/lib/auth';

import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRoutes = () => {
  const auth = useAuth();

  console.log(auth);

  return auth.user ? <ProtectedRoutes /> : <PublicRoutes />;
};
