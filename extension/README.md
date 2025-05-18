# Mindframe OS Extension

<!-- ...existing documentation... -->

## Development: Linting, Formatting, and Testing

To ensure the highest code quality and debug-friendliness, the codebase enforces strict linting, formatting, and full automated tests.

### Linting

```bash
npm run lint       # Check for lint errors (TypeScript + React)
npm run lint:fix   # Auto-fix lint errors where possible
```

### Formatting

```bash
npm run format     # Format all code with Prettier
```

### Testing

```bash
npm run test       # Run all tests with coverage using Jest
```

### Complete Quality Check

Run all checks (lint, format, test) before every commit or PR:

```bash
npm run check
```

Lint, format, and test configs are in `.eslintrc.json`, `.prettierrc`, and `jest.config.js`. See those files for details.