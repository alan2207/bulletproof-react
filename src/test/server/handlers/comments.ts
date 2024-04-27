import { HttpResponse, http } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, delayedResponse, errorResponse } from '../utils';

type CreateCommentBody = {
  body: string;
  discussionId: string;
};
type CommentId = { commentId: string };

export const commentsHandlers = [
  http.get(`${API_URL}/comments`, ({ request }) => {
    try {
      requireAuth(request);
      const url = new URL(request.url);
      const discussionId = url.searchParams.get('discussionId') ?? '';
      const result = db.comment.findMany({
        where: {
          discussionId: {
            equals: discussionId,
          },
        },
      });
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.post<never, CreateCommentBody>(`${API_URL}/comments`, async ({ request }) => {
    try {
      const user = requireAuth(request);
      const data = await request.json();
      const result = db.comment.create({
        authorId: user.id,
        id: nanoid(),
        createdAt: Date.now(),
        ...data,
      });
      persistDb('comment');
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.delete<CommentId>(`${API_URL}/comments/:commentId`, ({ params, request }) => {
    try {
      const user = requireAuth(request);
      const { commentId } = params;
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
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),
];
