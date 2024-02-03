# 🔐 Security

## Auth

NOTE: Handling Auth on the client doesn't mean it shouldn't be handled on the server. As a matter of fact, it is more important to protect the resources on the server, but it should be handled on the client as well for better user experience.

There are 2 parts of Auth:

### Authentication

Authentication is a process of identifying who the user is. The most common way of authenticating users in single page applications is via [JWT](https://jwt.io/). During logging in / registration you receive a token that you store in your application, and then on each authenticated request you send the token in the header or via cookie along with the request.

The safest option is to store the token in the app state, but if the user refreshes the app, its token will be lost.

That is why tokens are stored in `localStorage/sessionStorage` or in a cookie.

#### `localStorage` vs cookie for storing tokens

Storing it in `localStorage` could bring a security issue, if your application is vulnerable to [XSS](https://owasp.org/www-community/attacks/xss/) someone could steal your token.

Storing tokens in a cookie might be safer if the cookie is set to be `HttpOnly` which would mean it wouldn't be accessible from the client side JavaScript. The `localStorage` way is being used here for simplicity reasons, if you want to be more secure, you should consider using cookies but that is a decision that should be made together with the backend team.

To keep the application safe, instead of focusing only on where to store the token safely, it would be recommended to make the entire application as resistant as possible to XSS attacks E.g - every input from the user should be sanitized before it's injected into the DOM.

[HTML Sanitization Example Code](../src/components/Elements/MDPreview/MDPreview.tsx)

#### Handling user data

User info should be considered a global piece of state which should be available from anywhere in the application.
If you are already using `react-query`, you can use [react-query-auth](https://github.com/alan2207/react-query-auth) library for handling user state which will handle all the things for you after you provide it some configuration. Otherwise, you can use react context + hooks, or some 3rd party state management library.

[Auth Configuration Example Code](../src/lib/auth.tsx)

The application will assume the user is authenticated if a user object is present.

[Authenticated Route Protection Example Code](../src/routes/index.tsx)

### Authorization

Authorization is a process of determining if the user is allowed to access a resource.

#### RBAC (Role based access control)

[Authorization Configuration Example Code](../src/lib/authorization.tsx)

The most common method. Define allowed roles for a resource and then check if a user has the allowed role in order to access a resource. Good example is `USER` and `ADMIN` roles. You want to restrict some things for users and let admins access it.

[RBAC Example Code](../src/features/discussions/components/CreateDiscussion.tsx)

#### PBAC (Permission based access control)

Sometimes RBAC is not enough. Some of the operations should be allowed only by the owner of the resource. For example user's comment - only the author of the comment should be able to delete it. That's why you might want to use PBAC, as it is more flexible.

For RBAC protection you can use the `RBAC` component by passing allowed roles to it. On the other hand if you need more strict protection, you can pass policies check to it.

[PBAC Example Code](../src/features/comments/components/CommentsList.tsx)
