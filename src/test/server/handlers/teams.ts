import { HttpResponse, http } from 'msw';

import { API_URL } from '@/config';

import { db } from '../db';
import { delayedResponse, errorResponse } from '../utils';

export const teamsHandlers = [
  http.get(`${API_URL}/teams`, () => {
    try {
      const result = db.team.getAll();
      return delayedResponse(HttpResponse.json(result));
    } catch (error: any) {
      return delayedResponse(errorResponse(error));
    }
  }),
];
