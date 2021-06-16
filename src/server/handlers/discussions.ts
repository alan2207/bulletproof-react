import { rest } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse } from '../utils';

type DiscussionBody = {
  title: string;
  body: string;
};

export const discussionsHandlers = [
  rest.get(`${API_URL}/discussions`, (req, res, ctx) => {
    const user = requireAuth(req);
    const result = db.discussion.findMany({
      where: {
        teamId: {
          equals: user.teamId,
        },
      },
    });
    return delayedResponse(ctx.json(result));
  }),

  rest.get(`${API_URL}/discussions/:discussionId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const { discussionId } = req.params;
    const result = db.discussion.findFirst({
      where: {
        id: {
          equals: discussionId,
        },
        teamId: {
          equals: user.teamId,
        },
      },
    });
    return delayedResponse(ctx.json(result));
  }),

  rest.post<DiscussionBody>(`${API_URL}/discussions`, (req, res, ctx) => {
    const user = requireAuth(req);
    const data = req.body;
    requireAdmin(user);
    const result = db.discussion.create({
      teamId: user.teamId,
      id: nanoid(),
      ...data,
    });
    persistDb('discussion');
    return delayedResponse(ctx.json(result));
  }),

  rest.patch<DiscussionBody>(`${API_URL}/discussions/:discussionId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const data = req.body;
    const { discussionId } = req.params;
    requireAdmin(user);
    const result = db.discussion.update({
      where: {
        teamId: {
          equals: user.teamId,
        },
        id: {
          equals: discussionId,
        },
      },
      data,
    });
    persistDb('discussion');
    return delayedResponse(ctx.json(result));
  }),

  rest.delete(`${API_URL}/discussions/:discussionId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const { discussionId } = req.params;
    requireAdmin(user);
    const result = db.discussion.delete({
      where: {
        id: {
          equals: discussionId,
        },
      },
    });
    persistDb('discussion');
    return delayedResponse(ctx.json(result));
  }),
];
