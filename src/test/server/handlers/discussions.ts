import { HttpResponse, http } from 'msw';
import { nanoid } from 'nanoid';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, sanitizeUser } from '../utils';

type DiscussionBody = {
  title: string;
  body: string;
};

export const discussionsHandlers = [
  http.get(`${API_URL}/discussions`, async ({ request }) => {
    try {
      const user = requireAuth(request);
      const result = db.discussion
        .findMany({
          where: {
            teamId: {
              equals: user.teamId,
            },
          },
        })
        .map(({ authorId, ...discussion }) => {
          const author = db.user.findFirst({
            where: {
              id: {
                equals: authorId,
              },
            },
          });
          return {
            ...discussion,
            author: author ? sanitizeUser(author) : {},
          };
        });
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.get(`${API_URL}/discussions/:discussionId`, async ({ request, params }) => {
    try {
      const user = requireAuth(request);
      const discussionId = params.discussionId as string;
      const discussion = db.discussion.findFirst({
        where: {
          id: {
            equals: discussionId,
          },
          teamId: {
            equals: user.teamId,
          },
        },
      });

      if (!discussion) {
        return HttpResponse.json({ message: 'Discussion not found' }, { status: 404 });
      }

      const author = db.user.findFirst({
        where: {
          id: {
            equals: discussion.authorId,
          },
        },
      });

      // delete discussion.authorId;

      const result = {
        ...discussion,
        author: author ? sanitizeUser(author) : {},
      };

      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.post(`${API_URL}/discussions`, async ({ request }) => {
    try {
      const user = requireAuth(request);
      const data = (await request.json()) as DiscussionBody;
      requireAdmin(user);
      const result = db.discussion.create({
        teamId: user.teamId,
        id: nanoid(),
        createdAt: Date.now(),
        authorId: user.id,
        ...data,
      });
      persistDb('discussion');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.patch(`${API_URL}/discussions/:discussionId`, async ({ request, params }) => {
    try {
      const user = requireAuth(request);
      const data = (await request.json()) as DiscussionBody;
      const discussionId = params.discussionId as string;
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
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),

  http.delete(`${API_URL}/discussions/:discussionId`, async ({ request, params }) => {
    try {
      const user = requireAuth(request);
      const discussionId = params.discussionId as string;
      requireAdmin(user);
      const result = db.discussion.delete({
        where: {
          id: {
            equals: discussionId,
          },
        },
      });
      persistDb('discussion');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),
];
