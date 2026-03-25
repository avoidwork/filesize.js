# Contributing to filesize.js

Thank you for your interest in contributing to filesize.js! This document outlines the process for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Reporting Issues](#reporting-issues)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [License](#license)

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/filesize.js.git
   cd filesize.js
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development mode:
   ```bash
   npm run dev
   ```

## Reporting Issues

Before reporting an issue, please search existing issues to avoid duplicates.

When creating a new issue, include:
- A clear, descriptive title
- Steps to reproduce the problem
- Expected vs. actual behavior
- Environment details (Node.js version, OS, browser)
- Code samples if applicable

## Development Workflow

### Project Structure

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation
│   ├── helpers.js       # Helper functions
│   └── constants.js     # Constants and lookup tables
├── tests/
│   └── unit/            # Unit tests
├── dist/                # Built distributions (generated)
└── types/               # TypeScript definitions
```

### Building

```bash
npm run build           # Build all distributions
npm run build:watch     # Watch mode for development
npm run build:analyze   # Analyze bundle sizes
```

### Distribution Files

- `dist/filesize.cjs` - CommonJS
- `dist/filesize.js` - ES Module
- `dist/filesize.min.js` - Minified ES Module
- `dist/filesize.umd.js` - UMD (browser)
- `dist/filesize.umd.min.js` - Minified UMD

## Testing

### Running Tests

```bash
npm test              # Run all tests (lint + node:test)
npm run test:watch    # Live test watching
```

### Coverage Requirements

- **100% test coverage** is required for all changes
- Coverage includes: statements, branches, functions, and lines
- Run with coverage: `npm test`

### Writing Tests

Tests use Node.js built-in test runner (`node:test`):

```javascript
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { filesize } from '../../src/filesize.js';

describe('Feature', () => {
  it('should do something', () => {
    const result = filesize(1024);
    assert.strictEqual(result, '1.02 kB');
  });
});
```

### Test Coverage

```
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|-------------------
```

## Code Style

### Linting

We use oxlint (Rust-based, fast):

```bash
npm run lint        # Check code style
npm run lint:fix    # Auto-fix issues
```

### Formatting

We use oxfmt (Rust-based, fast):

```bash
npm run format:fix  # Format code
```

### Conventions

- **JSDoc**: Use JSDoc standard for all functions and classes
- **Naming**:
  - Functions: camelCase (`handleZeroValue`, `applyPrecisionHandling`)
  - Constants: UPPER_SNAKE_CASE (`IEC`, `JEDEC`, `BINARY_POWERS`)
- **Imports**: Group by source, alphabetize
- **Principles**: DRY, KISS, YAGNI, SOLID
- **Security**: OWASP best practices

### Code Style Example

```javascript
/**
 * Description
 * @param {type} param - Description
 * @returns {type} Description
 */
export function functionName(param) {
  // Implementation
}

// Constants
export const CONSTANT_NAME = 'value';

// Imports: group by source, alphabetize
import {
  ARRAY,
  BIT,
  BYTE
} from './constants.js';
import {
  helperFunction
} from './helpers.js';
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code restructuring
- `build`: Build system changes
- `test`: Test additions/fixes
- `chore`: Maintenance tasks

### Examples

```
feat: add precision option for significant digits
fix: correct bits auto-increment with forced exponent
docs: update README with TypeScript examples
refactor: simplify exponent auto-detection logic
build: update rollup configuration
test: add coverage for NaN exponent edge case
```

## Pull Request Process

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure:
   - All tests pass (`npm test`)
   - 100% test coverage is maintained
   - Code is formatted (`npm run format:fix`)
   - No linting errors (`npm run lint`)

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "type: description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues
   - Include test coverage for changes

### PR Checklist

- [ ] Tests pass (`npm test`)
- [ ] 100% test coverage maintained
- [ ] Code is formatted
- [ ] No linting errors
- [ ] Documentation updated (if applicable)
- [ ] Build successful (`npm run build`)

## License

By contributing to filesize.js, you agree that your contributions will be licensed under the BSD-3 license.

---

Thank you for contributing to filesize.js!
