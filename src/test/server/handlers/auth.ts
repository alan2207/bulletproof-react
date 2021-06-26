import { rest } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { authenticate, delayedResponse, hash, requireAuth } from '../utils';

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
  rest.post<RegisterBody>(`${API_URL}/auth/register`, (req, res, ctx) => {
    const userObject = req.body;

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
      role,
      password: hash(userObject.password),
      teamId,
    });

    persistDb('user');

    const result = authenticate({ email: userObject.email, password: userObject.password });

    return delayedResponse(ctx.json(result));
  }),

  rest.post<LoginBody>(`${API_URL}/auth/login`, (req, res, ctx) => {
    const credentials = req.body;
    const result = authenticate(credentials);
    return delayedResponse(ctx.json(result));
  }),

  rest.get(`${API_URL}/auth/me`, (req, res, ctx) => {
    const user = requireAuth(req);

    return delayedResponse(ctx.json(user));
  }),
];
