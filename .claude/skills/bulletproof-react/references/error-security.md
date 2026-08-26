# Error Handling & Security

## Error handling

**API errors** are handled once, in the API client's response interceptor (see api-layer.md): show a notification toast with the server's message, and on 401 either redirect to login/log the user out or fire a token-refresh request and retry — whichever the auth scheme supports. Individual components don't try/catch fetches.

**In-app errors** are contained by *multiple* error boundaries placed at meaningful seams — app root, layout, and per-route — not one global boundary. A crash in one route's content leaves navigation and the rest of the app usable. With react-router, routes get an `ErrorBoundary` export; elsewhere use `react-error-boundary`'s `<ErrorBoundary FallbackComponent={...}>`.

**Production tracking:** use Sentry (or similar) with uploaded source maps. Don't build your own error reporter.

## Auth

Client-side auth complements, never replaces, server-side protection.

**Token storage:** the most secure home for a token is in-memory application state — but it's wiped on refresh, logging the user out every reload, which is why tokens end up persisted in a cookie or `localStorage`. Between those two: `localStorage` is XSS-readable — a single injected script exfiltrates every user's token — so prefer cookies with `HttpOnly` (set by the API), invisible to client JavaScript. The client just sends `withCredentials: true`.

**XSS hygiene:** sanitize user-generated content before rendering (e.g. `dompurify` on markdown preview output). See OWASP client-side top 10 for the fuller list.

**User state:** the current user is global server-cache state, not store state. With react-query, `react-query-auth` wraps the pattern — configure it with `userFn`, `loginFn`, `registerFn`, `logoutFn` and it provides `useUser`, `useLogin`, `useRegister`, `useLogout`, and an `AuthLoader` component. The app treats "user object present" as authenticated. Route protection is a small `ProtectedRoute` wrapper that redirects to `paths.auth.login.getHref(currentPath)` when there's no user (preserving `redirectTo`).

## Authorization

Two levels, both provided by `src/lib/authorization.tsx`:

**RBAC** — roles (`ADMIN`, `USER`) checked against an allowlist. **PBAC** — per-resource policies for finer rules (e.g. only a comment's author or an admin may delete it):

```tsx
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    if (user.role === 'ADMIN') return true;
    if (user.role === 'USER' && comment.author?.id === user.id) return true;
    return false;
  },
};

export const useAuthorization = () => {
  const user = useUser();
  if (!user.data) throw Error('User does not exist!');

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role);
      }
      return true;
    },
    [user.data],
  );

  return { checkAccess, role: user.data.role };
};
```

The `Authorization` component gates UI declaratively and takes *either* roles *or* a policy result (a discriminated union prevents passing both):

```tsx
type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | { allowedRoles: RoleTypes[]; policyCheck?: never }
  | { allowedRoles?: never; policyCheck: boolean }
);
```

Usage:

```tsx
// RBAC — admins only:
<Authorization allowedRoles={[ROLES.ADMIN]}>
  <DeleteDiscussion id={discussion.id} />
</Authorization>

// PBAC — owner or admin:
<Authorization policyCheck={POLICIES['comment:delete'](user, comment)}>
  <DeleteComment id={comment.id} />
</Authorization>
```

UI gating is UX, not security — the API must enforce the same rules.
