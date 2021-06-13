import * as React from 'react';

import { useAuth } from './auth';

export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type RoleTypes = keyof typeof ROLES;

type RolesTypes =
  | {
      allowedRoles: RoleTypes[];
      forbiddenRoles?: never;
    }
  | {
      allowedRoles?: never;
      forbiddenRoles: RoleTypes[];
    };

export const useRBAC = () => {
  const { user } = useAuth();

  if (!user) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles, forbiddenRoles }: RolesTypes) => {
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(user.role);
      }

      if (forbiddenRoles && forbiddenRoles.length > 0) {
        return !forbiddenRoles.includes(user.role);
      }

      return true;
    },
    [user.role]
  );

  return { checkAccess };
};

type RBACProps =
  | {
      forbiddenFallback?: React.ReactNode;
      children: React.ReactNode;
    } & RolesTypes;

export const RBAC = ({
  allowedRoles,
  forbiddenRoles,
  forbiddenFallback = null,
  children,
}: RBACProps) => {
  const { checkAccess } = useRBAC();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  } else if (forbiddenRoles) {
    canAccess = checkAccess({ forbiddenRoles });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
