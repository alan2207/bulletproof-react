import { HttpResponse, http } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { authenticate, delayedResponse, errorResponse, hash, requireAuth } from '../utils';

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export const authHandlers = [
  http.post<never, RegisterBody>(`${API_URL}/auth/register`, async ({ request }) => {
    try {
      const userObject = await request.json();

      const existingUser = db.user.findFirst({
        where: {
          email: {
            equals: userObject.email,
          },
        },
      });

      if (existingUser) {
        throw new Error('The user already exists');
      }

      let teamId;
      let role;

      if (!userObject.teamId) {
        const team = db.team.create({
          id: nanoid(),
          name: userObject.teamName ?? `${userObject.firstName} Team`,
          createdAt: Date.now(),
        });
        persistDb('team');
        teamId = team.id;
        role = 'ADMIN';
      } else {
        const existingTeam = db.team.findFirst({
          where: {
            id: {
              equals: userObject.teamId,
            },
          },
        });

        if (!existingTeam) {
          throw new Error('The team you are trying to join does not exist!');
        }
        teamId = userObject.teamId;
        role = 'USER';
      }

      db.user.create({
        ...userObject,
        id: nanoid(),
        createdAt: Date.now(),
        role,
        password: hash(userObject.password),
        teamId,
      });

      persistDb('user');

      const result = authenticate({ email: userObject.email, password: userObject.password });

      return await delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.post<never, LoginBody>(`${API_URL}/auth/login`, async ({ request }) => {
    try {
      const credentials = await request.json();
      const result = authenticate(credentials);
      return await delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.get(`${API_URL}/auth/me`, async ({ request }) => {
    try {
      const user = requireAuth(request);

      return await delayedResponse(HttpResponse.json(user));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),
];
