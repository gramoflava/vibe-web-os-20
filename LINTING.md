# Code Quality Setup

This document explains how to set up and use ESLint and Prettier for code quality in Vibe Web OS 2.0.

## Prerequisites

Make sure you have Node.js and npm installed:
```bash
node --version
npm --version
```

## Installation

Install the development dependencies:

```bash
npm install
```

This will install:
- **ESLint** - JavaScript linting to catch errors and enforce code style
- **Prettier** - Code formatter for consistent formatting

## Usage

### Linting with ESLint

Check for linting errors:
```bash
npm run lint
```

Auto-fix linting errors where possible:
```bash
npm run lint:fix
```

### Formatting with Prettier

Format all files:
```bash
npm run format
```

Check if files are formatted correctly:
```bash
npm run format:check
```

## Configuration

### ESLint Configuration (`.eslintrc.json`)

The ESLint configuration enforces:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Modern ES6+ syntax
- No `var` keyword (use `const` or `let`)
- Proper spacing and formatting

### Prettier Configuration (`.prettierrc.json`)

The Prettier configuration provides:
- 2-space indentation
- Single quotes
- Semicolons
- 100 character line width
- Unix line endings (LF)

## IDE Integration

### VS Code

Install these extensions for automatic linting and formatting:

1. **ESLint** - `dbaeumer.vscode-eslint`
2. **Prettier** - `esbenp.prettier-vscode`

Add to your VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Ignored Files

The following files are ignored by ESLint and Prettier:
- `node_modules/`
- `dist/` and `build/`
- `sw.js` (service worker)

## Pre-commit Hooks (Optional)

For automatic linting/formatting before commits, you can add husky and lint-staged:

```bash
npm install --save-dev husky lint-staged
```

Then add to `package.json`:

```json
{
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write"],
    "*.{css,html,md}": ["prettier --write"]
  }
}
```

And initialize husky:
```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

## Code Quality Guidelines

### JavaScript Best Practices

1. **Use `const` by default** - Only use `let` when reassignment is needed
2. **Avoid `var`** - Use block-scoped `const` or `let`
3. **Use strict equality** - Always use `===` instead of `==`
4. **Add braces to all control structures** - Even single-line if statements
5. **Use descriptive variable names** - Avoid single-letter names except in loops
6. **Comment complex logic** - Use JSDoc for function documentation
7. **Keep functions small** - Each function should do one thing well
8. **Avoid global variables** - Use IIFEs or modules for encapsulation

### Code Style

- 2 spaces for indentation (no tabs)
- Single quotes for strings
- Semicolons at the end of statements
- Spaces around operators
- No trailing whitespace
- Unix line endings (LF)
- One newline at end of file

## Troubleshooting

### ESLint errors about undefined globals

If ESLint reports errors about global variables like `Bus`, `WindowManager`, etc., make sure they're defined in the `globals` section of `.eslintrc.json`.

### Prettier and ESLint conflicts

The configurations are set up to work together, but if you encounter conflicts:
1. Run Prettier first: `npm run format`
2. Then run ESLint: `npm run lint:fix`

### Installation issues

If you encounter issues with npm install:
1. Make sure you have Node.js 16+ installed
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`
4. Run `npm install` again
