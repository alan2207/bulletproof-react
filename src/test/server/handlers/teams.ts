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
    try {
      const user = requireAuth(req);

      const result = db.team.findFirst({
        where: {
          id: {
            equals: user.teamId,
          },
        },
      });

      return delayedResponse(ctx.json(result));
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),

  rest.get(`${API_URL}/teams`, (req, res, ctx) => {
    try {
      const result = db.team.getAll();
      return delayedResponse(ctx.json(result));
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),

  rest.patch<TeamBody>(`${API_URL}/team/:teamId`, (req, res, ctx) => {
    try {
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
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),
];
