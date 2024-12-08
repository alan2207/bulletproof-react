# 🔐 Security

## Auth

NOTE: While managing authentication on the client side is crucial, it is equally vital to implement robust security measures on the server to protect resources. Client-side authentication enhances user experience and complements server-side security measures.

Protecting resources comprises two key components:

### Authentication

Authentication is the process of verifying the identity of a user. In single-page applications (SPAs), the prevalent method of authenticating users is through JSON Web Tokens ([JWT](https://jwt.io/)). When a user logs in or registers, they receive a token that is stored within the application. Subsequently, for each authenticated request, the token is sent in the header or via a cookie along with the request to validate the user's identity and access permissions.

The most secure practice is to store the token in the application state. However, it's important to note that if the user refreshes the application, the token will be reset. That can lead to the loss of the user's authentication status.

That is why tokens need to be stored in a cookie or `localStorage/sessionStorage`.

#### `localStorage` vs cookie for storing tokens

Storing authentication tokens in localStorage can pose a security risk, especially in the context of Cross-Site Scripting ([XSS](https://owasp.org/www-community/attacks/xss/)) vulnerabilities, potentially leading to token theft by malicious actors.

Opting to store tokens in cookies, configured with the `HttpOnly` attribute, can enhance security as they are inaccessible to client-side JavaScript. In our sample app, we utilize js-cookie for cookie management, assuming the real API would enforce the HttpOnly attribute for enhanced security, and the application does not have access to the cookie from the client side.

In addition to securely storing tokens, it's crucial to protect the entire application from Cross-Site Scripting (XSS) attacks. One key strategy is to sanitize all user inputs before displaying them in the application. By carefully sanitizing inputs, you can reduce the risk of XSS vulnerabilities, making the application more resilient to malicious attacks and enhancing overall security for users.

[HTML Sanitization Example Code](../apps/react-vite/src/components/ui/md-preview/md-preview.tsx)

For a full list of security risks, check [OWASP](https://owasp.org/www-project-top-10-client-side-security-risks/).

#### Handling user data

User info should be considered a global piece of state which should be available from anywhere in the application.
If you are already using `react-query`, you can use [react-query-auth](https://github.com/alan2207/react-query-auth) library for handling user state which will handle all the things for you after you provide it some configuration. Otherwise, you can use react context + hooks, or some 3rd party state management library.

User information should be treated as a central piece of data accessible throughout the application. If you are already using `react-query`, consider using it for storing user data as well. Alternatively, you can leverage React context with hooks or opt for a third-party state management library to efficiently manage user state across your application.

[Auth Configuration Example Code](../apps/react-vite/src/lib/auth.tsx)

The application will assume the user is authenticated if a user object is present.

### Authorization

Authorization is the process of verifying whether a user has permission to access a specific resource within the application.

#### RBAC (Role based access control)

[Authorization Configuration Example Code](../apps/react-vite/src/lib/authorization.tsx)

In a role-based authorization model, access to resources is determined by defining specific roles and associating them with permissions. For example, roles such as `USER` and `ADMIN` can be assigned different levels of access rights within the application. Users are then granted access based on their roles; for instance, restricting certain functionalities to regular users while permitting administrators to access all features and functionalities.

[RBAC Example Code](../apps/react-vite/src/features/discussions/components/create-discussion.tsx)

#### PBAC (Permission based access control)

While Role-Based Access Control (RBAC) provides a structured methodology for authorization, there are instances where a more granular approach is necessary. Precision-Based Access Control (PBAC) offers a more flexible solution, particularly in scenarios where access permissions need to be finely tuned based on specific criteria, such as allowing only the owner of a resource to perform certain operations. For example, in the case of a user's comment, PBAC ensures that only the author of the comment has the privilege to delete it, adding a layer of precision and customization to access control mechanisms.

For RBAC protection, you can use the `RBAC` component by passing allowed roles to it. On the other hand, if you need more strict protection, you can pass policies check to it.

[PBAC Example Code](../apps/react-vite/src/features/comments/components/comments-list.tsx)
