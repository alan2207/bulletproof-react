# Testing

Strategy: **integration tests carry most of the confidence.** Unit tests are for shared components/utilities and genuinely complex isolated logic; e2e covers the critical user journeys end to end. Passing unit tests don't prove the connections between parts work — integration tests do.

## Tooling

| Tool | Role |
|------|------|
| vitest | test runner (jest-compatible, vite-native) |
| @testing-library/react | render + query by what the user sees, never implementation details |
| MSW | mock API at the network level via service worker / node interception |
| playwright | e2e — browser mode locally (rich inspection tooling, but expensive — dev only), headless in CI |

## Placement conventions

- Tests colocate with the code they test in `__tests__` folders: `src/components/ui/dialog/confirmation-dialog/__tests__/confirmation-dialog.test.tsx`.
- Integration tests live next to the route they exercise: `src/app/routes/app/discussions/__tests__/discussion.test.tsx`.
- e2e lives outside `src`: `e2e/tests/smoke.spec.ts`.
- `__tests__` folders are exempt from the kebab-case folder lint rule (already handled in the ESLint config).

## MSW mock API — `src/testing/mocks/`

Not fetch-mocking: a functioning fake server. Handlers implement endpoint business logic against an in-memory database (`@mswjs/data`), so tests (and local dev, gated by `env.ENABLE_API_MOCKING`) make real HTTP calls:

- `mocks/db.ts` — data models (user, team, discussion, comment) via `factory(...)`.
- `mocks/handlers/` — one file per resource implementing the endpoints (`auth.ts`, `discussions.ts`, ...), registered in `mocks/handlers/index.ts`.
- `src/testing/data-generators.ts` (sibling of `mocks/`, not inside it) — object factories for test data.

This means new features should extend the mock API: add the model to `db.ts` and a handler file for the resource, and the feature is developable and testable without a backend.

Two wiring details that bite:

- In dev, `main.tsx` **awaits** `enableMocking()` before calling `createRoot(...).render(...)` — the service worker must be intercepting before the first query fires, or early requests hit the real network.
- e2e doesn't use the service worker: a standalone MSW server (`mock-server.ts`, via `@mswjs/http-middleware`) serves the same handlers over real HTTP for Playwright runs.

## Test utilities — `src/testing/test-utils.tsx`

A `renderApp` wrapper renders components inside the real `AppProvider` (query client, error boundaries, auth) with a memory router, plus helpers that set up authenticated state through the mock API rather than by stubbing internals:

- `createUser` / `createDiscussion` — seed the mock DB.
- `loginAsUser(user)` — authenticate against the mock auth endpoint and set the auth cookie.
- `renderApp(ui, { user, url, path })` — render with providers; `user: null` renders unauthenticated. It already awaits `waitForLoadingToFinish()` internally, so tests usually don't need to call it again — prefer `screen.findBy*` queries for content that loads after render.
- `waitForLoadingToFinish()` — wait until all loading indicators are gone; for the rare case a test triggers a second load itself.

## Integration test shape

```tsx
import { renderApp, screen, createDiscussion } from '@/testing/test-utils';

test('should render discussion', async () => {
  const fakeDiscussion = await createDiscussion();

  await renderApp(<DiscussionRoute />, {
    url: `/app/discussions/${fakeDiscussion.id}`,
    path: '/app/discussions/:discussionId',
  });

  expect(await screen.findByText(fakeDiscussion.title)).toBeInTheDocument();
});
```

Assert on rendered output and user-visible behavior; refactoring state management must not break tests.
