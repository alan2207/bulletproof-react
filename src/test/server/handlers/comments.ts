import { rest } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, delayedResponse } from '../utils';

type CreateCommentBody = {
  body: string;
  discussionId: string;
};

export const commentsHandlers = [
  rest.get(`${API_URL}/comments`, (req, res, ctx) => {
    try {
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
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),

  rest.post<CreateCommentBody>(`${API_URL}/comments`, (req, res, ctx) => {
    try {
      const user = requireAuth(req);
      const data = req.body;
      const result = db.comment.create({
        authorId: user.id,
        id: nanoid(),
        createdAt: Date.now(),
        ...data,
      });
      persistDb('comment');
      return delayedResponse(ctx.json(result));
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),

  rest.delete(`${API_URL}/comments/:commentId`, (req, res, ctx) => {
    try {
      const user = requireAuth(req);
      const { commentId } = req.params;
      const result = db.comment.delete({
        where: {
          id: {
            equals: commentId,
          },
          ...(user.role === 'USER' && {
            authorId: {
              equals: user.id,
            },
          }),
        },
      });
      persistDb('comment');
      return delayedResponse(ctx.json(result));
    } catch (error: any) {
      return delayedResponse(
        ctx.status(400),
        ctx.json({ message: error?.message || 'Server Error' })
      );
    }
  }),
];
