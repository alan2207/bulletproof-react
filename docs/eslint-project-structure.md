# 🏗️ ESLint Project Structure Integration

> **Automated Architecture Enforcement for Bulletproof React**
> 
> This document explains the integration of `eslint-plugin-project-structure` to automatically enforce the bulletproof-react architecture patterns, ensuring scalable folder organization and preventing architectural violations.

## Overview

The ESLint project structure integration provides automated enforcement of:

- **Folder Structure Validation**: Ensures adherence to bulletproof-react directory patterns
- **Cross-Feature Import Prevention**: Maintains feature independence
- **Unidirectional Data Flow**: Enforces proper architectural boundaries
- **Naming Convention Compliance**: Validates file and component naming
- **File Composition Rules**: Ensures proper code organization within files

## Quick Start

### 1. Installation

```bash
# Install the plugin
npm install --save-dev eslint-plugin-project-structure

# Or with yarn
yarn add --dev eslint-plugin-project-structure
```

### 2. Configuration

The configuration is already set up in this repository:

- **`.project-structure.config.js`**: Core project structure rules
- **`eslint.config.js`**: ESLint integration with React and TypeScript rules

### 3. Usage

```bash
# Run ESLint with project structure validation
npx eslint . --fix

# Check specific directory
npx eslint apps/react-vite/src --fix
```

## Configuration Breakdown

### Folder Structure Rules

The configuration enforces the bulletproof-react folder structure:

```
apps/
└── [app-name]/
    └── src/
        ├── app/              # Application layer
        │   ├── routes/       # Application routes
        │   ├── app.tsx       # Main app component
        │   ├── provider.tsx  # Global providers
        │   └── router.tsx    # Router configuration
        ├── assets/           # Static assets
        ├── components/       # Shared components
        ├── config/           # Configuration files
        ├── features/         # Feature-based modules
        │   └── [feature]/
        │       ├── api/      # Feature-specific API
        │       ├── assets/   # Feature assets
        │       ├── components/ # Feature components
        │       ├── hooks/    # Feature hooks
        │       ├── stores/   # Feature state
        │       ├── types/    # Feature types
        │       └── utils/    # Feature utilities
        ├── hooks/            # Shared hooks
        ├── lib/              # Configured libraries
        ├── stores/           # Global state
        ├── testing/          # Test utilities
        ├── types/            # Shared types
        └── utils/            # Shared utilities
```

### Independent Modules

Prevents architectural violations:

1. **Cross-Feature Imports**: Features cannot import from other features
2. **Upward Dependencies**: Shared modules cannot import from features or app layer
3. **Circular Dependencies**: Features cannot import from the app layer

### File Composition Rules

Enforces proper file organization:

- **Component Files**: Must use PascalCase
- **Hook Files**: Must start with `use`
- **Type Files**: Must end with `.types.ts`
- **Test Files**: Must end with `.test.ts` or `.test.tsx`
- **Story Files**: Must end with `.stories.ts` or `.stories.tsx`

## Examples

### ✅ Valid Import Patterns

```typescript
// ✅ Feature importing from shared modules
import { Button } from '../../../components/Button';
import { useApi } from '../../../hooks/useApi';
import { ApiResponse } from '../../../types/api.types';

// ✅ App layer importing from features
import { AuthFeature } from '../features/auth/AuthFeature';

// ✅ Feature internal imports
import { UserCard } from './components/UserCard';
import { useUserData } from './hooks/useUserData';
```

### ❌ Invalid Import Patterns

```typescript
// ❌ Cross-feature imports
import { UserCard } from '../users/components/UserCard';

// ❌ Shared module importing from features
import { AuthService } from '../features/auth/AuthService';

// ❌ Feature importing from app layer
import { AppRouter } from '../app/AppRouter';
```

## Best Practices

### 1. Feature Independence

- Keep features completely independent
- Use shared modules for common functionality
- Compose features at the application level

### 2. Unidirectional Data Flow

```
Shared Modules → Features → App Layer
    ↑              ↑         ↑
  Base Layer   Business    Orchestration
```

### 3. Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `use*.ts` (e.g., `useUserData.ts`)
- **Types**: `*.types.ts` (e.g., `user.types.ts`)
- **Tests**: `*.test.ts` (e.g., `UserProfile.test.tsx`)
- **Stories**: `*.stories.ts` (e.g., `UserProfile.stories.tsx`)

### 4. File Organization

```typescript
// UserProfile.tsx - Proper file composition

// 1. Interfaces and types first
interface UserProfileProps {
  userId: string;
}

type UserStatus = 'active' | 'inactive';

// 2. Component implementation
function UserProfile({ userId }: UserProfileProps) {
  // Component logic
}

// 3. Default export
export default UserProfile;
```

## Troubleshooting

### Common Violations

1. **Cross-Feature Import**
   ```
   ESLint: Cross-feature imports are not allowed. Features should be independent modules.
   ```
   **Solution**: Move shared functionality to shared modules or use feature composition.

2. **Invalid Folder Structure**
   ```
   ESLint: File/folder outside allowed structure
   ```
   **Solution**: Reorganize files according to bulletproof-react structure.

3. **Naming Convention Violation**
   ```
   ESLint: File name should follow PascalCase convention
   ```
   **Solution**: Rename files according to the naming conventions.

### Configuration Customization

To customize rules for your specific needs:

1. **Edit `.project-structure.config.js`** for folder structure rules
2. **Modify `eslint.config.js`** for linting integration
3. **Test changes** with `npx eslint . --dry-run`

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/eslint.yml
name: ESLint Project Structure
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx eslint . --max-warnings 0
```

## Related Documentation

- [🗄️ Project Structure](./project-structure.md) - Core architecture guidelines
- [⚙️ Project Standards](./project-standards.md) - Development standards
- [🧪 Testing](./testing.md) - Testing strategies

## Contributing

When contributing to this project:

1. Follow the established folder structure
2. Run ESLint before committing: `npm run lint`
3. Ensure all architectural rules pass
4. Update documentation when adding new patterns

## References

- [eslint-plugin-project-structure](https://github.com/Igorkowalski94/eslint-plugin-project-structure) - Plugin documentation
- [Bulletproof React Issue #204](https://github.com/alan2207/bulletproof-react/issues/204) - Original feature request
- [ESLint Configuration](https://eslint.org/docs/latest/use/configure/) - ESLint setup guide

---

**Implementation by:** [Ravikant Diwakar](https://github.com/ravikant-diwakar)  
**Related to:** [Issue #204](https://github.com/alan2207/bulletproof-react/issues/204)  
**Plugin:** [eslint-plugin-project-structure](https://github.com/Igorkowalski94/eslint-plugin-project-structure)
