import { requireAuth, requireAdmin, db } from './utils';

export function invitesRoutes(server) {
  server.get('/invites', (schema, request) => {
    const user = requireAuth(request);
    requireAdmin(user);
    return schema.invites.findBy({ teamId: user.teamId });
  });

  server.post('/invites', (schema, request) => {
    const user = requireAuth(request);
    const data = JSON.parse(request.requestBody);
    requireAdmin(user);
    const result = schema.invites.create({ teamId: user.teamId, ...data });
    db.persist('invites', schema);
    return result;
  });

  server.delete('/invites/:inviteId', (schema, request) => {
    const user = requireAuth(request);
    const { inviteId } = request.params;
    requireAdmin(user);
    const result = schema.invites.remove({ teamId: user.teamId, id: inviteId });
    db.persist('invites', schema);
    return result;
  });
}
