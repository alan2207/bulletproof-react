import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db } from '../db';
import { networkDelay } from '../utils';

export const teamsHandlers = [
  http.get(`${env.API_URL}/teams`, async () => {
    await networkDelay();

    try {
      const result = db.team.getAll();
      return HttpResponse.json({ data: result });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
