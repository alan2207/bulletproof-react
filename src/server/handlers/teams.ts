import { rest } from 'msw';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse } from '../utils';

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

    return delayedResponse(ctx.json(result));
  }),

  rest.get(`${API_URL}/teams`, (req, res, ctx) => {
    const result = db.team.getAll();
    return delayedResponse(ctx.json(result));
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

    return delayedResponse(ctx.json(result));
  }),
];
