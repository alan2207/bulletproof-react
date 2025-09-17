# Bulletproof React - Next.js App

## Overview
This is a demonstration of the Bulletproof React architecture using Next.js 14 with the App Router. The project showcases modern React patterns, best practices, and a scalable application structure.

## Recent Changes (September 17, 2025)
- Set up Next.js app for Replit environment
- Configured development server to bind to 0.0.0.0:5000 for proxy compatibility
- Created environment configuration with proper variables
- Set up deployment configuration for production
- Removed unnecessary dotenv import, relying on Next.js built-in env loading
- Added default value for ENABLE_API_MOCKING to prevent undefined values

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom component system
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Testing**: Vitest + Testing Library + Playwright (E2E)
- **Build System**: Standard Next.js build process

## Key Features
- Authentication system with login/register
- Discussion/forum functionality  
- User management and profiles
- Comment system
- Responsive design with modern UI components
- Mock API integration for development
- Type-safe environment configuration

## Development
- Dev server runs on port 5000 with hot reloading
- Environment variables configured in `.env.local`
- Mock API integration enabled for demo functionality
- Full TypeScript support with strict configuration

## Deployment
- Configured for autoscale deployment target
- Production build uses `yarn build` followed by `yarn start`
- Server binds to 0.0.0.0:5000 in production for proper hosting

This setup demonstrates modern React development practices in a production-ready application structure.