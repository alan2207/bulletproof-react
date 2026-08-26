# Changes vs fixture

**Run:** eval-0-scaffold-feature-bare-app/without_skill


## New files (40)

- `.env.example`
- `src/app/index.tsx`
- `src/app/provider.tsx`
- `src/app/router.tsx`
- `src/app/routes/not-found.tsx`
- `src/app/routes/route-error.tsx`
- `src/app/routes/tasks/tasks.module.css`
- `src/app/routes/tasks/tasks.tsx`
- `src/components/errors/error-boundary.tsx`
- `src/components/errors/error-fallback.module.css`
- `src/components/errors/error-fallback.tsx`
- `src/components/layouts/main-layout.module.css`
- `src/components/layouts/main-layout.tsx`
- `src/components/ui/button.module.css`
- `src/components/ui/button.tsx`
- `src/components/ui/field.module.css`
- `src/components/ui/index.ts`
- `src/components/ui/input.tsx`
- `src/components/ui/spinner.module.css`
- `src/components/ui/spinner.tsx`
- `src/components/ui/textarea.tsx`
- `src/config/env.ts`
- `src/config/paths.ts`
- `src/features/tasks/api/create-task.ts`
- `src/features/tasks/api/get-tasks.ts`
- `src/features/tasks/api/query-keys.ts`
- `src/features/tasks/components/create-task-form.module.css`
- `src/features/tasks/components/create-task-form.tsx`
- `src/features/tasks/components/task-list-item.tsx`
- `src/features/tasks/components/task-list.module.css`
- `src/features/tasks/components/task-list.tsx`
- `src/features/tasks/index.ts`
- `src/features/tasks/types.ts`
- `src/lib/api-client.ts`
- `src/lib/react-query.ts`
- `src/styles/global.css`
- `src/types/api.ts`
- `src/utils/cn.ts`
- `src/utils/format.ts`
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

- New barrel index files: ['src/components/ui/index.ts', 'src/features/tasks/index.ts']
- Non-kebab-case new files: none
- .eslintrc.cjs contains import/no-restricted-paths: False
- Feature zones mentioned in eslint config: ['features/tasks']