# Auth

NOTE: Handling Auth on the client doesn't mean you shouldn't handle it on the server. In fact, it is more important to protect the resources on the server, but it should be handled on the client as well.

There are 2 parts of Auth:

### Authentication

Authentication is a process of identifying who the user is. The most popular way of authenticating users is via [JWT](https://jwt.io/). During logging in / registration you receive a token that you store in `localStorage` or a cookie, and then on each authenticated request you send the token in the header along with the request.

User info should be considered a global piece of state which should be available from anywhere in the application.
If you are already using `react-query`, you can use [react-query-auth](https://github.com/alan2207/react-query-auth) library for handling user state which will handle all the things for you after you provide it some configuration. Otherwise you can use react context + hooks, or some 3rd party state management library. You can find a practical example at [`src/lib/auth.tsx`](../src/lib/auth.tsx).

[Auth Configuration Example Code](../src/lib/auth.tsx)

The application will assume the user is authenticated if a user object is present.

[Authenticated Route Protection Example Code](../src/routes/index.tsx)

### Authorization

Authorization is a process of determining if the user is allowed to access a resource.

#### RBAC (Role based access control)

The most common method. Define allowed roles for a resource and then check if a user has the allowed role in order to access a resource. Good example is `USER` and `ADMIN` roles. You want to restrict some things for users and let admins access it.

[RBAC Example Code](../src/features/discussions/components/CreateDiscussion.tsx)

#### PBAC (Permission based access control)

Sometimes RBAC is not enough. Some of the operations should be allowed only by the owner of the resource. For example user's comment - only the author of the comment should be able to delete it. That's why you might want to use PBAC, as it is more flexible.

For apractical example you can check [`src/lib/rbac.tsx`](../src/lib/rbac.tsx)

For RBAC protection you can use the `RBAC` component by passing allowed roles to it. On the other hand if you need more strict protection, you can pass policies check to it.

[PBAC Example Code](../src/features/comments/components/CommentsList.tsx)
