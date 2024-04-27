import omit from 'lodash/omit';
import { DefaultBodyType, HttpResponse, StrictRequest, StrictResponse, delay } from 'msw';

import { db } from './db';

const isTesting = process.env.NODE_ENV === 'test' || ((window as any).Cypress as any);

export const errorResponse = ({ message }: Error) =>
  HttpResponse.json({ message: message || 'Server Error' }, { status: 400 });

export const delayedResponse = async <T extends StrictResponse<DefaultBodyType>>(response: T) => {
  await delay(isTesting ? 0 : 1000);
  return response;
};

export const hash = (str: string) => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
};

export const sanitizeUser = (user: any) => omit(user, ['password', 'iat']);

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

    // TODO: jsonwebtoken doesn't support browsers, find an alternative
    // const encodedToken = jwt.sign(sanitizedUser, JWT_SECRET);
    const encodedToken = JSON.stringify({ id: user.id });

    return { user: sanitizedUser, jwt: encodedToken };
  }

  const error = new Error('Invalid username or password');
  throw error;
}

export function requireAuth(request: StrictRequest<DefaultBodyType>) {
  try {
    const encodedToken = request.headers.get('authorization');
    if (!encodedToken) {
      throw new Error('No authorization token provided!');
    }

    // TODO: jsonwebtoken doesn't support browsers, find an alternative
    // const decodedToken = JSON.parse(encodedToken) as { id: string };
    const decodedToken = JSON.parse(encodedToken) as { id: string };

    const user = db.user.findFirst({
      where: {
        id: {
          equals: decodedToken.id,
        },
      },
    });

    if (!user) {
      throw Error('Unauthorized');
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
