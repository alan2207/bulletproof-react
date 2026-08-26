---
name: bulletproof-react
description: Scaffold, structure, and review React applications using the bulletproof-react architecture — feature-based folders, unidirectional imports (shared → features → app), a typed API layer with configurable react-query hooks, and ESLint-enforced module boundaries. Use this whenever the user creates a new React app or feature, adds API calls, data fetching, or state management, restructures a React codebase, or asks whether React code follows good architecture — even if they never say "bulletproof". Do NOT use it for generic React concept explanations, runtime debugging, performance profiling, build/deploy failures, pure styling tweaks, or standalone utility/regex snippets.
---

# Bulletproof React

Architecture conventions distilled from [bulletproof-react](https://github.com/alan2207/bulletproof-react) (react-vite reference implementation). The goal: a codebase where features are independent modules, dependencies flow in one direction, and the structure itself prevents entanglement — so the app stays easy to change as it grows.

## Which workflow?

- **Adding a feature to an existing app** → follow "Scaffolding a feature" below. This is the most common task and the one with the most traps.
- **Setting up a new app** → read `references/app-setup.md` for provider, router, env, paths, and ESLint boilerplate, then scaffold features as above.
- **Adding API calls / data fetching** → follow "API layer" below; full exemplars in `references/api-layer.md`.
- **Choosing where state lives** → "State management" below.
- **Performance concerns (re-renders, bundle size, prefetching)** → performance section of `references/state-components.md`; route-level code splitting in `references/app-setup.md`.
- **Reviewing code** → "Review checklist" at the end.

## Project structure

Application code lives in `src`, split into shared modules, features, and the app layer:

```
src
├── app/          # app layer: routes/, app.tsx, provider.tsx, router.tsx
├── assets/       # static files (images, fonts)
├── components/   # shared components used across the app
├── config/       # env variables (validated), paths registry
├── features/     # feature-based modules — most code goes here
├── hooks/        # shared hooks
├── lib/          # preconfigured libraries (api client, react-query, auth)
├── stores/       # global state stores
├── testing/      # test utilities and MSW mocks
├── types/        # shared types
└── utils/        # shared utilities
```

Each feature is a self-contained folder:

```
src/features/awesome-feature
├── api/         # request declarations + hooks for this feature
├── assets/      # feature-specific static files
├── components/  # feature-scoped components
├── hooks/       # feature-scoped hooks
├── stores/      # feature-scoped state
├── types/       # feature-scoped types
└── utils/       # feature-scoped utilities
```

Only create the subfolders a feature actually needs — an api-only feature is just `features/x/api/`.

One sanctioned variation: if many API calls are shared between features, keep all request declarations in a dedicated top-level `api/` folder instead of per-feature `api/` folders. That is the correct escape valve when endpoints don't belong to a single feature — reaching across feature boundaries is not.

## Non-negotiables

These rules are what make the architecture work. Violating any of them quietly reintroduces the coupling the structure exists to prevent:

1. **Unidirectional imports: shared → features → app.** Shared modules (`components`, `hooks`, `lib`, `types`, `utils`) import nothing from `features` or `app`. Features import shared code only. The app layer may import both. Code flows one way, so any file's possible dependencies are predictable from its location.
2. **No cross-feature imports.** `features/discussions` never imports from `features/comments`. When two features must interact, compose them at the app layer (a route renders components from both) — this keeps each feature independently deletable.
3. **No feature barrel files.** Do not create `index.ts` re-export files for features or their subfolders. Import directly from the defining file (`@/features/discussions/api/get-discussions`). Feature barrels defeat Vite tree-shaking and hide the real dependency graph — and they make cross-feature imports invisible. (Scope matters: the reference app does keep small `index.ts` files for shared `components/ui/*` folders; the ban is about feature modules.)
4. **Register every new feature in the ESLint boundary zones.** The `import/no-restricted-paths` config lists each feature explicitly. A feature that isn't registered is silently unprotected — lint passes while cross-feature imports creep in. This is the single most-forgotten step; see the checklist below.
5. **kebab-case for all files and folders** (`discussion-view.tsx`, not `DiscussionView.tsx`). Enforced via `check-file` ESLint plugin.
6. **Absolute imports via `@/*`** (maps to `./src/*` in tsconfig). Never `../../../`.

## Scaffolding a feature

Adding feature `<name>` touches four places. Do them all — the last two are the ones everyone forgets:

1. **Create the feature module** at `src/features/<name>/` with only the subfolders needed. API declarations per endpoint (see "API layer"), components that consume them.
2. **Add route files** at `src/app/routes/app/<name>/` and register them in `src/app/router.tsx` using route-level code splitting:
   ```tsx
   {
     path: paths.app.<name>.path,
     lazy: () => import('./routes/app/<name>/<name>').then(convert(queryClient)),
   }
   ```
3. **Register paths** in `src/config/paths.ts` — every route gets a `path` and a `getHref()` so links are never hand-assembled strings:
   ```ts
   <name>: {
     path: '<name>',
     getHref: () => '/app/<name>',
   },
   ```
4. **Register the ESLint zone** in `.eslintrc.cjs` under `import/no-restricted-paths` → `zones`, alongside the existing feature entries:
   ```js
   {
     target: './src/features/<name>',
     from: './src/features',
     except: ['./<name>'],
   },
   ```
   Without this entry, nothing stops other features from importing `<name>`'s internals. Add it even if the app currently has one feature — the zone list must grow with the features list.

If the project doesn't yet have the unidirectional zones (features ← app, shared ← features/app), add those too — full config in `references/app-setup.md`.

## API layer

One pre-configured API client instance for the whole app (`src/lib/api-client.ts`): axios (or fetch) with a base URL from validated env, a request interceptor for auth headers, and a response interceptor that unwraps `response.data`, surfaces errors as notifications, and handles 401s (redirect to login, log the user out, or trigger a token refresh — whichever the app's auth scheme calls for).

Each endpoint gets its own file in the owning feature's `api/` folder, containing three things — types/schemas, a fetcher, and a hook:

**Query** (`features/discussions/api/get-discussions.ts`):

```ts
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Discussion, Meta } from '@/types/api';

export const getDiscussions = (
  page = 1,
): Promise<{ data: Discussion[]; meta: Meta }> => {
  return api.get(`/discussions`, { params: { page } });
};

export const getDiscussionsQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['discussions', { page }] : ['discussions'],
    queryFn: () => getDiscussions(page),
  });
};

type UseDiscussionsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

export const useDiscussions = ({ queryConfig, page }: UseDiscussionsOptions) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    ...queryConfig,
  });
};
```

**Mutation** (`features/discussions/api/create-discussion.ts`):

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Discussion } from '@/types/api';

import { getDiscussionsQueryOptions } from './get-discussions';

export const createDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export type CreateDiscussionInput = z.infer<typeof createDiscussionInputSchema>;

export const createDiscussion = ({
  data,
}: {
  data: CreateDiscussionInput;
}): Promise<Discussion> => {
  return api.post(`/discussions`, data);
};

type UseCreateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({
  mutationConfig,
}: UseCreateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createDiscussion,
  });
};
```

The details that matter (and are easy to drop):

- **Hooks are configurable.** Every hook accepts `queryConfig` / `mutationConfig` so callers can override caching, callbacks, `enabled`, etc. without new hooks. The `QueryConfig` / `MutationConfig` helper types live in `src/lib/react-query.ts` (see `references/api-layer.md`) and infer everything from the fetcher — no hand-written generics per endpoint.
- **Export `queryOptions` separately** from the hook, so route loaders can `queryClient.prefetchQuery(getDiscussionsQueryOptions(...))` and mutations can invalidate with `getDiscussionsQueryOptions().queryKey` — the query key is defined in exactly one place, never re-typed as a string literal elsewhere.
- **Validate mutation input with zod** and export the schema; the form consuming the mutation reuses it for client-side validation.

Full versions — api-client with interceptors, `react-query.ts` helper types, validated env — in `references/api-layer.md`.

## State management

Don't reach for a global store by default. Classify the state first, then use the lightest tool that fits:

| Kind | Use | Example |
|------|-----|---------|
| Component state | `useState` / `useReducer`, lift only when needed | open/closed, input drafts |
| Application state | context + hooks, or zustand/jotai — kept as close to consumers as possible | notifications, theme, modals |
| Server cache | react-query (or swr) — never mirror server data into a store | anything fetched |
| Form state | react-hook-form + zod, wrapped in an app `Form` abstraction | login, create-discussion |
| URL state | route params / query string via the router | page number, selected id |

The most common review finding: server data copied into a global store, or state globalized "just in case". Both cause needless re-renders and stale-data bugs. Details and library options in `references/state-components.md`.

## Review checklist

When reviewing a codebase claiming (or needing) this architecture, check in order of impact:

1. Cross-feature imports (`features/x` importing `features/y`) — including transitively via barrels.
2. Shared modules (`components`, `lib`, `hooks`, `utils`, `types`) importing from `features` or `app`.
3. Features present in `src/features/` but missing from the ESLint `import/no-restricted-paths` zones.
4. Barrel `index.ts` files re-exporting feature internals.
5. API calls made inline in components instead of declared in `api/` files; query keys re-typed as string literals at call sites instead of taken from the exported `queryOptions`.
6. Hooks that hard-code query/mutation options with no `queryConfig`/`mutationConfig` escape hatch.
7. Server data mirrored into global stores; state more global than its consumers require.
8. Naming drift: PascalCase files, relative `../../` imports.

## References

Read these when the task goes deeper than the summaries above:

- `references/app-setup.md` — new-app boilerplate: provider composition, router with lazy `convert()` pattern, zod-validated env, paths registry, complete ESLint config (boundary zones, import order, naming), tsconfig paths, TypeScript refactoring guidance, Husky hooks.
- `references/api-layer.md` — full api-client with interceptors, `react-query.ts` helper types, additional patterns (infinite queries, prefetching in route loaders).
- `references/state-components.md` — state category details, component best practices (composition over props, no nested render functions, wrapping 3rd-party components), form abstraction, styling options.
- `references/testing.md` — integration-first strategy, vitest + testing-library + playwright + MSW setup, colocated `__tests__` convention, mock API with msw handlers + data models.
- `references/error-security.md` — error interceptor + segmented error boundaries + Sentry; JWT storage (HttpOnly cookie over localStorage), input sanitization, react-query-auth, RBAC/PBAC authorization component.
