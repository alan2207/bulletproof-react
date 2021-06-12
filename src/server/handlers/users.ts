import { rest } from 'msw';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse } from '../utils';

export const usersHandlers = [
  rest.get(`${API_URL}/users`, (req, res, ctx) => {
    const user = requireAuth(req);
    const result = db.user.findMany({
      where: {
        teamId: {
          equals: user.teamId,
        },
      },
    });

    return delayedResponse(ctx.json(result));
  }),

  rest.delete(`${API_URL}/users/:userId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const { userId } = req.params;
    requireAdmin(user);
    const result = db.user.delete({
      where: {
        id: {
          equals: userId,
        },
        teamId: {
          equals: user.teamId,
        },
      },
    });
    persistDb('user');
    return delayedResponse(ctx.json(result));
  }),
];
