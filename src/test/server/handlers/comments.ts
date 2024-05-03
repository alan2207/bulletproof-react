import { HttpResponse, http } from 'msw';
import { nanoid } from 'nanoid';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { requireAuth, sanitizeUser } from '../utils';

type CreateCommentBody = {
  body: string;
  discussionId: string;
};

export const commentsHandlers = [
  http.get(`${env.API_URL}/comments`, ({ request, cookies }) => {
    try {
      requireAuth(cookies);
      const url = new URL(request.url);
      const discussionId = url.searchParams.get('discussionId') || '';
      const comments = db.comment
        .findMany({
          where: {
            discussionId: {
              equals: discussionId,
            },
          },
        })
        .map(({ authorId, ...comment }) => {
          const author = db.user.findFirst({
            where: {
              id: {
                equals: authorId,
              },
            },
          });
          return {
            ...comment,
            author: author ? sanitizeUser(author) : {},
          };
        });
      return HttpResponse.json(comments);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.post(`${env.API_URL}/comments`, async ({ request, cookies }) => {
    try {
      const user = requireAuth(cookies);
      const data = (await request.json()) as CreateCommentBody;
      const result = db.comment.create({
        authorId: user?.id,
        id: nanoid(),
        createdAt: Date.now(),
        ...data,
      });
      persistDb('comment');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.delete(`${env.API_URL}/comments/:commentId`, ({ params, cookies }) => {
    try {
      const user = requireAuth(cookies);
      const commentId = params.commentId as string;
      const result = db.comment.delete({
        where: {
          id: {
            equals: commentId,
          },
          ...(user?.role === 'USER' && {
            authorId: {
              equals: user.id,
            },
          }),
        },
      });
      persistDb('comment');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),
];
