# Agent Guidelines for filesize.js

## Project Overview

filesize.js is a lightweight, high-performance file size utility that converts bytes to human-readable strings. It supports multiple unit standards (SI, IEC, JEDEC), localization, and various output formats.

**Key Facts:**
- **Single source file**: `src/filesize.js` (214 lines)
- **Helper functions**: `src/helpers.js` (180 lines)  
- **Constants**: `src/constants.js` (81 lines)
- **Zero dependencies**: Uses only native JavaScript APIs
- **100% test coverage**: 139 tests passing

## Coding Conventions

### From `.cursor/rules/javascript.mdc`

- **JSDoc**: Use JSDoc standard for all functions and classes
- **Naming**: 
  - Functions: camelCase (`handleZeroValue`, `applyPrecisionHandling`)
  - Constants: UPPER_SNAKE_CASE (`IEC`, `JEDEC`, `BINARY_POWERS`)
- **Testing**: 
  - Unit tests in `tests/unit/` using node-assert + mocha
  - Integration tests in `tests/integration/` using node-assert + mocha
- **Principles**: DRY, KISS, YAGNI, SOLID
- **Security**: OWASP best practices

### Code Style

```javascript
// Function with JSDoc
/**
 * Description
 * @param {type} param - Description
 * @returns {type} Description
 */
export function functionName (param) {
  // Implementation
}

// Constants
export const CONSTANT_NAME = "value";

// Imports: group by source, alphabetize
import {
  ARRAY,
  BIT,
  BYTE
} from "./constants.js";
import {
  helperFunction
} from "./helpers.js";
```

## Project Structure

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation (filesize + partial)
│   ├── helpers.js       # Helper functions (5 exported functions)
│   └── constants.js     # Constants, symbols, lookup tables
├── tests/
│   ├── unit/
│   │   └── filesize-helpers.test.js  # Helper function tests
│   └── integration/
│       └── filesize.test.js          # Integration tests
├── dist/                # Built distributions (generated)
├── types/               # TypeScript definitions
└── docs/                # Documentation
```

## Core Architecture

### Data Flow

```
Input → Validation → Standard Normalization → Exponent Calculation 
→ Value Conversion → Formatting → Output Generation
```

### Key Components

1. **`filesize(arg, options)`**: Main conversion function
2. **`partial(options)`**: Creates pre-configured function
3. **`handleZeroValue()`**: Special handling for zero input
4. **`calculateOptimizedValue()`**: Core conversion logic
5. **`applyPrecisionHandling()`**: Precision + scientific notation fix
6. **`applyNumberFormatting()`**: Locale, separator, padding

### Standard Selection

- **SI (default)**: Base 10, uses JEDEC symbols (kB, MB, GB)
- **IEC**: Base 1024, binary prefixes (KiB, MiB, GiB)
- **JEDEC**: Base 1024, uses traditional symbols (KB, MB, GB)

## Common Tasks

### Adding a New Feature

1. Add constants to `src/constants.js` if needed
2. Implement logic in `src/filesize.js` or `src/helpers.js`
3. Add JSDoc documentation
4. Write unit tests in `tests/unit/`
5. Write integration tests in `tests/integration/`
6. Run `npm test` to verify 100% coverage maintained
7. Run `npm run build` to update distributions

### Fixing a Bug

1. Write a failing test first
2. Implement the fix
3. Verify test passes
4. Run full test suite
5. Check for regressions

### Modifying `partial()`

**Important**: Keep `partial()` simple:
```javascript
export function partial (options = {}) {
  return arg => filesize(arg, options);
}
```

Do NOT destructure with defaults in `partial()` - let `filesize()` handle defaults.

## API Reference

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bits` | boolean | `false` | Calculate bits instead of bytes |
| `pad` | boolean | `false` | Pad decimal places |
| `base` | number | `-1` | Number base (2, 10, or -1 for auto) |
| `round` | number | `2` | Decimal places to round |
| `locale` | string\|boolean | `""` | Locale for formatting |
| `separator` | string | `""` | Custom decimal separator |
| `spacer` | string | `" "` | Value-unit separator |
| `symbols` | Object | `{}` | Custom unit symbols |
| `standard` | string | `""` | Unit standard (si, iec, jedec) |
| `output` | string | `"string"` | Output format (string, array, object, exponent) |
| `fullform` | boolean | `false` | Use full unit names |
| `fullforms` | Array | `[]` | Custom full unit names |
| `exponent` | number | `-1` | Force specific exponent |
| `roundingMethod` | string | `"round"` | Math.round, floor, or ceil |
| `precision` | number | `0` | Significant digits |

### Output Formats

- **string**: `"1.5 KB"` (default)
- **array**: `[1.5, "KB"]`
- **object**: `{value: 1.5, symbol: "KB", exponent: 1, unit: "KB"}`
- **exponent**: `1`

## Testing Guidelines

### Running Tests

```bash
npm test              # Full test suite (lint + mocha)
npm run mocha         # Tests only
npm run test:watch    # Live test watching
```

### Test Structure

```javascript
import assert from 'assert';
import { filesize } from '../../src/filesize.js';

describe('Feature', () => {
  it('should do something', () => {
    const result = filesize(1024);
    assert.strictEqual(result, "1.02 kB");
  });
});
```

### Coverage Requirements

- **100%** statement, branch, function, and line coverage required
- No uncovered lines allowed
- Use `c8` for coverage reports

## Build Process

```bash
npm run build         # Build all distributions
npm run dev           # Development mode with live reload
npm run build:watch   # Watch mode
npm run build:analyze # Bundle size analysis
```

### Distribution Files

- `dist/filesize.cjs` - CommonJS
- `dist/filesize.js` - ES Module
- `dist/filesize.min.js` - Minified ES Module
- `dist/filesize.umd.js` - UMD (browser)
- `dist/filesize.umd.min.js` - Minified UMD

## Performance Considerations

### Fast Operations (>10M ops/sec)
- Basic conversions: `filesize(1024)`
- Large numbers: `filesize(1073741824)`
- Standard output formats

### Slower Operations (<100K ops/sec)
- Locale formatting: `filesize(1024, {locale: "en-US"})`

### Optimization Tips
1. Cache `partial()` formatters for reuse
2. Avoid locale formatting in performance-critical code
3. Use `object` output for fastest structured data access

## Common Patterns

### Creating Formatters

```javascript
import { partial } from 'filesize';

const formatBinary = partial({base: 2, standard: "iec"});
const formatBits = partial({bits: true});
const formatPrecise = partial({round: 3, pad: true});
```

### Error Handling

```javascript
try {
  filesize("invalid");
} catch (error) {
  // TypeError: "Invalid number"
}
```

### BigInt Support

```javascript
filesize(BigInt(1024)); // "1.02 kB"
filesize(BigInt("10000000000000000000")); // Works with huge numbers
```

## Documentation Standards

### JSDoc Template

```javascript
/**
 * Function description
 * @param {type} paramName - Parameter description
 * @param {type} [paramName=default] - Optional parameter
 * @returns {type} Return description
 * @throws {ErrorType} When condition occurs
 * @example
 * // Example usage
 * functionName(arg); // "result"
 */
```

### When to Update Docs

- Add/modify function parameters
- Change default values
- Add new features
- Update examples

## Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Run tests: `npm test`
4. Build: `npm run build`
5. Commit: `git commit -m "type: description"`
6. Push: `git push origin feature/name`

### Commit Message Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code restructuring
- `build`: Build system changes
- `test`: Test additions/fixes

## Troubleshooting

### Tests Fail After Build
Run `npm test` before committing. The build process doesn't run tests automatically.

### Coverage Drops Below 100%
Check the c8 report for uncovered lines. Add tests for missing branches.

### Linting Errors
Run `npm run lint:fix` to auto-fix common issues.

## Quick Reference

**Files to modify:**
- `src/filesize.js` - Main logic (95% of changes)
- `src/helpers.js` - Helper functions
- `src/constants.js` - Constants/lookup tables

**Commands:**
- `npm test` - Run everything
- `npm run build` - Build distributions
- `npm run lint` - Check code style

**Key constraints:**
- No external dependencies
- 100% test coverage required
- JSDoc on all exported functions
- ES Modules only (no CommonJS in src/)
