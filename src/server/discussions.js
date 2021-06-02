import { requireAuth, requireAdmin, db } from './utils';

export function discussionsRoutes(server) {
  server.get('/discussions', (schema, request) => {
    const user = requireAuth(request);
    return schema.discussions.findBy({ teamId: user.teamId });
  });

  server.get('/discussions/:discussionId', (schema, request) => {
    const user = requireAuth(request);
    const { discussionId } = request.params;
    requireOwnTeam(user, teamId);
    return schema.discussions.findBy({ teamId: user.teamId, id: discussionId });
  });

  server.post('/discussions', (schema, request) => {
    const user = requireAuth(request);
    const data = JSON.parse(request.requestBody);
    requireAdmin(user);
    const result = schema.discussions.create({ teamId: user.teamId, ...data });
    db.persist('discussions', schema);
    return result;
  });

  server.patch('/discussions/:discussionId', (schema, request) => {
    const user = requireAuth(request);
    const data = JSON.parse(request.requestBody);
    const { discussionId } = request.params;
    requireAdmin(user);
    const result = schema.discussions.update({ teamId: user.teamId, id: discussionId }, data);
    db.persist('discussions', schema);
    return result;
  });

  server.delete('/discussions/:discussionId', (schema, request) => {
    const user = requireAuth(request);
    const { discussionId } = request.params;
    requireAdmin(user);
    const result = schema.discussions.remove({ teamId: user.teamId, id: discussionId });
    db.persist('discussions', schema);
    return result;
  });
}
