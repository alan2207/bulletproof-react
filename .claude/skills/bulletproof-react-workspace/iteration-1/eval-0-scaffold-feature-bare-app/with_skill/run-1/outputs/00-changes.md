# Changes vs fixture

**Run:** eval-0-scaffold-feature-bare-app/with_skill


## New files (34)

- `.env`
- `.env.example`
- `.prettierrc`
- `src/app/app.tsx`
- `src/app/provider.tsx`
- `src/app/router.tsx`
- `src/app/routes/app/root.tsx`
- `src/app/routes/app/tasks/tasks.tsx`
- `src/app/routes/landing.tsx`
- `src/app/routes/not-found.tsx`
- `src/components/errors/error-boundary.tsx`
- `src/components/errors/main.tsx`
- `src/components/layouts/content-layout.tsx`
- `src/components/ui/button/button.tsx`
- `src/components/ui/form/field-wrapper.tsx`
- `src/components/ui/form/form.tsx`
- `src/components/ui/form/input.tsx`
- `src/components/ui/form/textarea.tsx`
- `src/components/ui/notifications/notification.tsx`
- `src/components/ui/notifications/notifications-store.ts`
- `src/components/ui/notifications/notifications.tsx`
- `src/components/ui/spinner/spinner.tsx`
- `src/config/env.ts`
- `src/config/paths.ts`
- `src/features/tasks/api/create-task.ts`
- `src/features/tasks/api/get-tasks.ts`
- `src/features/tasks/components/create-task.tsx`
- `src/features/tasks/components/task-list-item.tsx`
- `src/features/tasks/components/tasks-list.tsx`
- `src/index.css`
- `src/lib/api-client.ts`
- `src/lib/react-query.ts`
- `src/types/api.ts`
- `src/vite-env.d.ts`

## Modified files (5)

- `.eslintrc.cjs`
- `package.json`
- `src/main.tsx`
- `tsconfig.json`
- `vite.config.ts`

## Deleted files (1)

- `src/App.tsx`


## Automated checks

- New barrel index files: none
- Non-kebab-case new files: none
- .eslintrc.cjs contains import/no-restricted-paths: True
- Feature zones mentioned in eslint config: ['features/tasks']