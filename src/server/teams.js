import { requireAuth, requireAdmin, db } from './utils';

export function teamsRoutes(server) {
  server.get('/team', (schema, request) => {
    const user = requireAuth(request);
    return schema.teams.find(user.teamId);
  });

  server.patch('/team', (schema, request) => {
    const user = requireAuth(request);
    const data = JSON.parse(request.requestBody);
    requireAdmin(user);
    const result = schema.teams.update(user.teamId, data);
    db.persist('teams', schema);
    return result;
  });
}
