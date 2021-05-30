import { authenticate, hash, db, requireAuth } from "./utils";

export function authRoutes(server) {
  server.post("/auth/register", (schema, request) => {
    const userObject = JSON.parse(request.requestBody);

    const existingUser = schema.users.findBy({ email: userObject.email });

    if (existingUser) {
      throw new Error("The user already exists");
    }

    console.log({ userObject });

    schema.users.create({ ...userObject, password: hash(userObject.password) });

    db.persist("users", schema);

    const { jwt, user } = authenticate(
      { email: userObject.email, password: userObject.password },
      schema
    );

    return {
      jwt,
      user,
    };
  });
  server.post("/auth/login", (schema, request) => {
    const credentials = JSON.parse(request.requestBody);

    return authenticate(credentials, schema);
  });
  server.get("/auth/me", (schema, request) => {
    const user = requireAuth(request);

    return {
      data: user,
    };
  });
}
