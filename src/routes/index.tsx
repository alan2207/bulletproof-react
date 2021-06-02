import { useAuth } from '@/lib/auth';

import { ProtectedRoutes } from './ProtectedRoutes';
import { PublicOnlyRoutes } from './PublicOnlyRoutes';

export const AppRoutes = () => {
  const auth = useAuth();

  console.log(auth);

  return auth.user ? <ProtectedRoutes /> : <PublicOnlyRoutes />;
};
