import omit from 'lodash/omit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config';

export const db = {
  load() {
    return JSON.parse(window.localStorage.getItem('mirage-db')) ?? {};
  },
  persist(collection, schema) {
    const db = this.load();
    db[collection] = schema.db[collection];
    window.localStorage.setItem('mirage-db', JSON.stringify(db));
  },
};

export function hash(str) {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

export const sanitizeUser = (user) => omit(user, ['password', 'iat']);

export function authenticate({ email, password }, schema) {
  const user = schema.users.findBy({ email })?.attrs;

  if (user?.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    const encodedToken = jwt.sign(sanitizedUser, JWT_SECRET);
    return { user: sanitizedUser, jwt: encodedToken };
  }

  const error = new Error('Invalid username or password');
  error.status = 400;
  throw error;
}

export function requireAuth(request) {
  try {
    const encodedToken = request.requestHeaders.authorization;
    const user = jwt.verify(encodedToken, JWT_SECRET);

    return sanitizeUser(user);
  } catch (err) {
    throw new Error(err);
  }
}
