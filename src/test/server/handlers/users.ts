import { HttpResponse, http } from 'msw';

import { API_URL } from '@/config';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, delayedResponse, errorResponse } from '../utils';

type ProfileBody = {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
};
type UserId = { userId: string };

export const usersHandlers = [
  http.get(`${API_URL}/users`, ({ request }) => {
    try {
      const user = requireAuth(request);
      const result = db.user.findMany({
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

  http.patch<never, ProfileBody>(`${API_URL}/users/profile`, async ({ request }) => {
    try {
      const user = requireAuth(request);
      const data = await request.json();
      const result = db.user.update({
        where: {
          id: {
            equals: user.id,
          },
        },
        data,
      });
      persistDb('user');
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),

  http.delete<UserId>(`${API_URL}/users/:userId`, ({ params, request }) => {
    try {
      const user = requireAuth(request);
      const { userId } = params;
      requireAdmin(user);
      const result = db.user.delete({
        where: {
          id: {
            equals: userId,
          },
          teamId: {
            equals: user.teamId,
          },
        },
      });
      persistDb('user');
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),
];
