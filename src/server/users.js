import { requireAuth, requireAdmin, db } from './utils';

export function usersRoutes(server) {
  server.get('/users', (schema, request) => {
    const user = requireAuth(request);
    return schema.users.findBy({ teamId: user.teamId });
  });

  server.delete('/users/:userId', (schema, request) => {
    const user = requireAuth(request);
    const { userId } = request.params;
    requireAdmin(user);
    const result = schema.users.remove({ teamId: user.teamId, id: userId });
    db.persist('users', schema);
    return result;
  });
}
