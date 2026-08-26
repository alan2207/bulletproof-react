import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { requireAuth, networkDelay } from '../utils';

type ProjectBody = {
  name: string;
  description: string;
};

export const projectsHandlers = [
  http.get(`${env.API_URL}/projects`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }

      const url = new URL(request.url);

      const page = Number(url.searchParams.get('page') || 1);

      const total = db.project.count({
        where: {
          teamId: {
            equals: user?.teamId,
          },
        },
      });

      const totalPages = Math.ceil(total / 10);

      const result = db.project.findMany({
        where: {
          teamId: {
            equals: user?.teamId,
          },
        },
        take: 10,
        skip: 10 * (page - 1),
      });

      return HttpResponse.json({
        data: result,
        meta: {
          page,
          total,
          totalPages,
        },
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),

  http.post(`${env.API_URL}/projects`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error) {
        return HttpResponse.json({ message: error }, { status: 401 });
      }
      const data = (await request.json()) as ProjectBody;
      const result = db.project.create({
        teamId: user?.teamId,
        ...data,
      });
      await persistDb('project');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
