import { requireAuth, requireAdmin, db } from './utils';

export function commentsRoutes(server) {
  server.get('/comments', (schema, request) => {
    const user = requireAuth(request);
    const { discussionId } = request.queryParams;
    return schema.comments.findBy({ discussionId });
  });

  server.post('/comments', (schema, request) => {
    const user = requireAuth(request);
    const data = JSON.parse(request.requestBody);
    const result = schema.comments.create({ userId: user.id, ...data });
    db.persist('comments', schema);
    return result;
  });

  server.delete('/comments/:commentId', (schema, request) => {
    const user = requireAuth(request);
    const { commentId } = request.params;
    requireAdmin(user);
    const result = schema.comments.remove({ id: commentId });
    db.persist('comments', schema);
    return result;
  });
}
