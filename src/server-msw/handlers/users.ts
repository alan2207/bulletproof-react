import { rest } from 'msw';

import { API_URL } from '@/config';
import { requireAdmin } from '@/server/utils';

import { db, persistDb } from '../db';
import { requireAuth } from '../utils';

export const usersHandlers = [
  rest.get(`${API_URL}/users`, (req, res, ctx) => {
    const user = requireAuth(req);
    const result = db.user.findFirst({
      where: {
        teamId: user.teamId,
      },
    });

    return res(ctx.json(result));
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
    return res(ctx.json(result));
  }),
];
