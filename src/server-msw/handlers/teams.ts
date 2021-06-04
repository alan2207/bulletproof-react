import { rest } from 'msw';

import { API_URL } from '@/config';
import { requireAdmin } from '@/server/utils';

import { db, persistDb } from '../db';
import { requireAuth } from '../utils';

type TeamBody = {
  name: string;
  description: string;
};

export const teamsHandlers = [
  rest.get(`${API_URL}/team`, (req, res, ctx) => {
    const user = requireAuth(req);

    const result = db.team.findFirst({
      where: {
        id: {
          equals: user.teamId,
        },
      },
    });

    return res(ctx.json(result));
  }),

  rest.get(`${API_URL}/teams`, (req, res, ctx) => {
    const result = db.team.getAll();
    return res(ctx.json(result));
  }),

  rest.patch<TeamBody>(`${API_URL}/team/:teamId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const data = req.body;
    requireAdmin(user);
    const result = db.team.update({
      where: {
        id: user.teamId,
      },
      data,
    });
    persistDb('team');

    return res(ctx.json(result));
  }),
];
