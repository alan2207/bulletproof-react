import { HttpResponse, http } from 'msw';

import { API_URL } from '@/config';

import { db } from '../db';

export const teamsHandlers = [
  http.get(`${API_URL}/teams`, () => {
    try {
      const result = db.team.getAll();
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json({ message: error?.message || 'Server Error' }, { status: 500 });
    }
  }),
];
