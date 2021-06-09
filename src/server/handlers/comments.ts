import { rest } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse } from '../utils';

type CreateCommentBody = {
  body: string;
  discussionId: string;
};

export const commentsHandlers = [
  rest.get(`${API_URL}/comments`, (req, res, ctx) => {
    requireAuth(req);
    const discussionId = req.url.searchParams.get('discussionId') || '';
    const result = db.comment.findMany({
      where: {
        discussionId: {
          equals: discussionId,
        },
      },
    });
    return delayedResponse(ctx.json(result));
  }),

  rest.post<CreateCommentBody>(`${API_URL}/comments`, (req, res, ctx) => {
    const user = requireAuth(req);
    const data = req.body;
    const result = db.comment.create({
      authorId: user.id,
      id: nanoid(),
      ...data,
    });
    persistDb('comment');
    return delayedResponse(ctx.json(result));
  }),

  rest.delete(`${API_URL}/comments/:commentId`, (req, res, ctx) => {
    const user = requireAuth(req);
    const { commentId } = req.params;
    requireAdmin(user);
    const result = db.comment.delete({
      where: {
        id: {
          equals: commentId,
        },
      },
    });
    persistDb('comment');
    return delayedResponse(ctx.json(result));
  }),
];
