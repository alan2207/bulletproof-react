import { authenticate, hash, db, requireAuth } from './utils';

export function authRoutes(server) {
  server.post('/auth/register', (schema, request) => {
    const userObject = JSON.parse(request.requestBody);

    userObject.role = 'ADMIN';
    const existingUser = schema.users.findBy({ email: userObject.email });

    if (existingUser) {
      throw new Error('The user already exists');
    }

    const team = schema.teams.create({ name: `${userObject.first_name} Team` });

    schema.users.create({ ...userObject, password: hash(userObject.password), team });

    db.persist('users', schema);
    db.persist('teams', schema);

    const { jwt, user } = authenticate(
      { email: userObject.email, password: userObject.password },
      schema
    );

    return {
      jwt,
      user,
    };
  });
  server.post('/auth/login', (schema, request) => {
    const credentials = JSON.parse(request.requestBody);

    return authenticate(credentials, schema);
  });
  server.post('/auth/complete-invitation', (schema, request) => {
    return {};
  });
  server.get('/auth/me', (schema, request) => {
    const user = requireAuth(request);

    return {
      data: user,
    };
  });
}
