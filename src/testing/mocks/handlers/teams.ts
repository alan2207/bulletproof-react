import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db } from '../db';

export const teamsHandlers = [
  http.get(`${env.API_URL}/teams`, () => {
    try {
      const result = db.team.getAll();
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
