import Cookies from 'js-cookie';

import { db } from './db';
export const encode = (obj: any) => window.btoa(JSON.stringify(obj));

export const decode = (str: string) => JSON.parse(window.atob(str));

export const hash = (str: string) => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
};

const omit = <T extends object>(obj: T, keys: string[]): T => {
  const result = {} as T;
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

export const sanitizeUser = <O extends object>(user: O) => omit<O>(user, ['password', 'iat']);

export function authenticate({ email, password }: { email: string; password: string }) {
  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (user?.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    const encodedToken = encode(sanitizedUser);
    return { user: sanitizedUser, jwt: encodedToken };
  }

  const error = new Error('Invalid username or password');
  throw error;
}

export const AUTH_COOKIE = `bulletproof_react_app_token`;

export function requireAuth(cookies: Record<string, string>, shouldThrow = true) {
  try {
    // todo: fix once tests in Github Actions are fixed
    // const encodedToken = cookies[AUTH_COOKIE];
    const encodedToken = Cookies.get(AUTH_COOKIE);
    if (!encodedToken) {
      if (shouldThrow) {
        throw new Error('No authorization token provided!');
      }

      return null;
    }
    const decodedToken = decode(encodedToken) as { id: string };

    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      if (shouldThrow) {
        throw Error('Unauthorized');
      }
      return null;
    }

    return sanitizeUser(user);
  } catch (err: any) {
    throw new Error(err);
  }
}

export function requireAdmin(user: any) {
  if (user.role !== 'ADMIN') {
    throw Error('Unauthorized');
  }
}
