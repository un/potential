# CLAUDE.md - 1up Project Guidelines

## Build, Lint, Test Commands
- **Build:** `pnpm build` (builds all packages)
- **Lint:** `pnpm lint` or `pnpm lint:fix` (add `--fix` to auto-fix issues)  
- **Typecheck:** `pnpm typecheck` (runs TypeScript type checking)
- **Dev:** `pnpm dev` (start development servers)
- **iOS:** `pnpm ios` (run mobile app on iOS simulator)

## Code Style Guidelines
- Use **functional and declarative programming** patterns; avoid classes
- Use **TypeScript** with proper interfaces and types
- Use **Zod** for schema validation and type inference
- Use lowercase with dashes for directory names (e.g., `components/auth-wizard`)
- Favor **named exports** for components and functions
- Structure files: exported component, subcomponents, helpers, types
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Implement guard clauses to handle error conditions early
- Use **early returns** for error conditions
- Backend: All queries should use **tRPC** and **Drizzle ORM**
- All data exchanged with the backend should be validated using Zod schemas
- UI: Use Tailwind CSS, Shadcn UI (web), Nativewind (mobile)
- Minimize `useEffect` and `setState`, favor React Server Components when possible