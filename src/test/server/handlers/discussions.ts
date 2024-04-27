import { HttpResponse, http } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse, errorResponse } from '../utils';

type DiscussionBody = {
  title: string;
  body: string;
};
type DiscussionId = { discussionId: string };

export const discussionsHandlers = [
  http.get(`${API_URL}/discussions`, ({ request }) => {
    try {
      const user = requireAuth(request);
      const result = db.discussion.findMany({
        where: {
          teamId: {
            equals: user.teamId,
          },
        },
      });
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.get<DiscussionId>(`${API_URL}/discussions/:discussionId`, ({ params, request }) => {
    try {
      const user = requireAuth(request);
      const { discussionId } = params;
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
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.post<never, DiscussionBody>(`${API_URL}/discussions`, async ({ request }) => {
    try {
      const user = requireAuth(request);
      const data = await request.json();
      requireAdmin(user);
      const result = db.discussion.create({
        teamId: user.teamId,
        id: nanoid(),
        createdAt: Date.now(),
        ...data,
      });
      persistDb('discussion');
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.patch<DiscussionId, DiscussionBody>(
    `${API_URL}/discussions/:discussionId`,
    async ({ params, request }) => {
      try {
        const user = requireAuth(request);
        const data = await request.json();
        const { discussionId } = params;
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
        return delayedResponse(HttpResponse.json(result));
      } catch (error: any) {
        return delayedResponse(errorResponse(error));
      }
    }
  ),

  http.delete<DiscussionId>(`${API_URL}/discussions/:discussionId`, ({ params, request }) => {
    try {
      const user = requireAuth(request);
      const { discussionId } = params;
      requireAdmin(user);
      const result = db.discussion.delete({
        where: {
          id: {
            equals: discussionId,
          },
        },
      });
      persistDb('discussion');
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),
];
