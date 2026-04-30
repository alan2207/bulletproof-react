# AGENTS.md

## Project Overview

Bulletproof React is a scalable React application architecture that provides opinionated guidelines and best practices for building production-ready React applications. The project includes three different implementations:

- **React Vite**: Modern Vite-based React application
- **Next.js App Router**: Next.js 13+ with App Router
- **Next.js Pages**: Traditional Next.js with Pages Router

### Application Domain
The demo application is a team collaboration platform where users can:
- Create and join teams
- Start discussions within teams  
- Comment on discussions
- Manage user roles (ADMIN/USER permissions)

**Live Demo**: [https://bulletproof-react-app.netlify.app](https://bulletproof-react-app.netlify.app)

## Setup Commands

```bash
# Navigate to desired app
cd apps/react-vite        # or apps/nextjs-app or apps/nextjs-pages

# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Lint code
yarn lint

# Build for production
yarn build
```

## Project Structure

The codebase follows a feature-based architecture organized as follows:

```
src/
├── app/              # Application layer (routes, providers, router)
├── components/       # Shared UI components
├── config/          # Global configurations and env variables
├── features/        # Feature-based modules (auth, discussions, comments, etc.)
├── hooks/           # Shared React hooks
├── lib/             # Preconfigured libraries (react-query, auth, etc.)
├── testing/         # Test utilities and mocks
├── types/           # Shared TypeScript types
└── utils/           # Shared utility functions
```

### Feature Structure
Each feature should be self-contained:

```
src/features/awesome-feature/
├── api/         # API calls and hooks for this feature
├── components/  # Feature-specific components  
├── hooks/       # Feature-specific hooks
├── stores/      # Feature-specific state
├── types/       # Feature-specific types
└── utils/       # Feature-specific utilities
```

## Code Standards

### TypeScript
- **Strict mode enabled** - All TypeScript strict checks are enforced
- **Type-first approach** - Define types before implementation
- **Absolute imports** - Use `@/` prefix for all src imports (e.g., `@/components/ui/button`)

### Code Style
- **ESLint + Prettier** configured for consistent formatting
- **Kebab-case** for file and folder names
- **PascalCase** for React components
- **camelCase** for functions and variables

### Architecture Rules
- **No cross-feature imports** - Features should not import from each other
- **Unidirectional flow** - Code flows: shared → features → app
- **Colocation** - Keep related code as close as possible to where it's used

## Component Guidelines

### Best Practices
- **Composition over props** - Use children/slots instead of many props
- **Single responsibility** - Each component should have one clear purpose  
- **Extract render functions** - Move complex JSX into separate components
- **Limit prop count** - Consider composition if accepting too many props

### Styling
- **Tailwind CSS** is the primary styling solution
- **Headless UI components** using Radix UI primitives
- **ShadCN/UI pattern** - Components are copied into codebase, not installed as packages

## State Management Strategy

### Component State
- Use `useState` for simple independent state
- Use `useReducer` for complex state with multiple related updates

### Application State  
- **Zustand** for global application state (modals, notifications, themes)
- Keep state as close to usage as possible
- Avoid premature globalization

### Server State
- **React Query (TanStack Query)** for all server state management
- **MSW (Mock Service Worker)** for API mocking during development
- Separate fetcher functions from hooks

### Form State
- **React Hook Form** for form management
- **Zod** for form validation schemas
- Create reusable Form and Input components

## API Layer

### Structure
Each API endpoint should have:
1. **Types & validation schemas** for request/response
2. **Fetcher function** using configured API client
3. **React Query hook** for data fetching/caching

### Example Pattern
```typescript
// api/get-discussions.ts
export const getDiscussions = (params: GetDiscussionsParams): Promise<Discussion[]> => {
  return api.get('/discussions', { params });
};

export const useDiscussions = (params: GetDiscussionsParams) => {
  return useQuery({
    queryKey: ['discussions', params],
    queryFn: () => getDiscussions(params),
  });
};
```

## Testing Strategy

### Testing Pyramid
1. **Integration Tests** (primary focus) - Test feature workflows
2. **Unit Tests** - Test shared utilities and complex logic
3. **E2E Tests** - Test critical user journeys

### Tools
- **Vitest** - Test runner (Jest-compatible but faster)
- **Testing Library** - Component testing utilities
- **Playwright** - E2E testing framework
- **MSW** - API mocking for tests

### Testing Patterns
- Test behavior, not implementation details
- Use real HTTP requests with MSW instead of mocking fetch
- Focus on user interactions and outcomes

## Security Considerations

### Authentication
- **JWT tokens** stored in HttpOnly cookies (preferred) or localStorage
- **React Query Auth** for user state management
- Automatic token refresh handling

### Authorization
- **RBAC** (Role-Based Access Control) for basic permissions
- **PBAC** (Permission-Based Access Control) for granular control
- Client-side authorization for UX (always validate server-side)

### XSS Prevention
- **Sanitize all user inputs** before rendering
- Use DOMPurify for HTML content sanitization
- Validate and escape data at boundaries

## Performance Optimization

### Code Splitting
- **Route-level splitting** - Lazy load pages/routes
- Avoid excessive splitting (balance requests vs. bundle size)

### React Optimizations
- **Children prop pattern** - Prevent unnecessary re-renders
- **State colocation** - Keep state close to where it's used
- **State initializer functions** - For expensive initial computations

### Image Optimization
- Lazy loading for images outside viewport
- Modern formats (WebP) with fallbacks
- Responsive images using srcset

## Error Handling

### API Errors
- Global error interceptor in API client
- Automatic error notifications via toast system
- Automatic token refresh on 401 errors

### Application Errors
- **Error Boundaries** at feature level (not just app level)
- **Sentry** integration for production error tracking
- Graceful fallbacks for broken components

## Build and Deployment

### Development
- **Vite** for fast development builds and HMR
- **TypeScript** strict mode for compile-time safety
- **ESLint + Prettier** for code quality

### Production
- Deploy to CDN platforms: **Vercel**, **Netlify**, or **AWS CloudFront**
- Source maps uploaded to Sentry for error tracking
- Environment-specific configuration via env files

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-discussions.ts`)  
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **Types**: `kebab-case.ts` (e.g., `api-types.ts`)
- **Folders**: `kebab-case` throughout

## Development Workflow

### Git Hooks (Husky)
- **Pre-commit**: ESLint, Prettier, TypeScript check
- **Pre-push**: Run test suite
- Ensure all checks pass before allowing commits

### Code Generation
- **Plop.js** generators for consistent component creation
- Templates include component, stories, and test files
- Maintains consistent structure across team

## Key Libraries

### Core
- **React 18** with concurrent features
- **TypeScript** in strict mode
- **Vite** or **Next.js** for build tooling

### UI & Styling  
- **Tailwind CSS** for styling
- **Radix UI** for headless components
- **Lucide React** for icons

### Data & State
- **TanStack Query** for server state
- **Zustand** for client state
- **React Hook Form + Zod** for forms

### Testing & Development
- **Vitest** for unit/integration tests
- **Playwright** for E2E tests
- **MSW** for API mocking
- **Storybook** for component development

## Common Patterns

### Feature Development
1. Start with API types and validation schemas
2. Create API fetcher functions and React Query hooks
3. Build UI components with proper TypeScript integration
4. Add integration tests covering the feature workflow
5. Update routing and navigation as needed

### Component Creation
1. Use Plop generator: `yarn generate:component`
2. Follow composition patterns over prop drilling
3. Add Storybook stories for complex components
4. Include unit tests for components with logic

### State Management
1. Start with local component state
2. Lift to parent component if needed by siblings
3. Move to global state only if needed across features
4. Use React Query for all server state

This architecture prioritizes developer experience, maintainability, and scalability while following React and JavaScript best practices.
