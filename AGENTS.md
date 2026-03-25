# Agent Guidelines for filesize.js

## Project Overview

filesize.js is a lightweight, high-performance file size utility that converts bytes to human-readable strings. It supports multiple unit standards (SI, IEC, JEDEC), localization, and various output formats.

**Key Facts:**
- **Single source file**: `src/filesize.js` (285 lines)
- **Helper functions**: `src/helpers.js` (215 lines)  
- **Constants**: `src/constants.js` (81 lines)
- **Zero dependencies**: Uses only native JavaScript APIs
- **100% test coverage**: 149 tests passing

## Coding Conventions

- **JSDoc**: Use JSDoc standard for all functions and classes
- **Naming**: 
  - Functions: camelCase (`handleZeroValue`, `applyPrecisionHandling`)
  - Constants: UPPER_SNAKE_CASE (`IEC`, `JEDEC`, `BINARY_POWERS`)
- **Testing**: 
  - Unit tests in `tests/unit/` using `node:test` + node:assert
  - Use `describe()` and `it()` from `node:test`
- **Linting**: oxlint (fast Rust-based linter)
- **Formatting**: oxfmt (fast Rust-based formatter)
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
│   └── unit/
│       └── filesize-helpers.test.js  # Helper function tests
│       └── filesize.test.js          # Main function tests
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

**Important**: `partial()` uses destructuring to freeze option values for immutability:
```javascript
export function partial({
  bits = false,
  pad = false,
  base = -1,
  round = 2,
  // ... other options
} = {}) {
  return (arg) =>
    filesize(arg, {
      bits,
      pad,
      base,
      round,
      // ... same options
    });
}
```

- Destructuring extracts and freezes primitive values at creation time
- Prevents mutations to original options object from affecting created formatters
- Simpler than deep cloning while maintaining immutability for all option types

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
npm test              # Full test suite (lint + node:test)
npm run test:watch    # Live test watching
```

### Test Structure

```javascript
import assert from 'node:assert';
import { describe, it } from 'node:test';
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
- Coverage reported by Node's built-in test runner with `--experimental-test-coverage`

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

try {
  partial({ exponent: NaN }); // Works - NaN is preserved via destructuring
} catch (error) {
  // No error - destructuring handles all primitive values
}
```

### Padding with Negative Numbers

When using `pad: true` with negative numbers, the decimal separator detection must skip the minus sign:
```javascript
// Correct: slice(1) to skip minus sign
const x = separator || (resultStr.slice(1).match(/(\D)/g) || []).pop() || PERIOD;
```

Without this, `-1.00` would split on `-` instead of `.`, producing incorrect output like `-10 kB` instead of `-1.00 kB`.

### BigInt Support

```javascript
filesize(BigInt(1024)); // "1.02 kB"
filesize(BigInt("10000000000000000000")); // Works with huge numbers
```

### Auto-Exponent Pattern

When checking if the exponent should auto-calculate, use a named variable for clarity and coverage:
```javascript
const autoExponent = exponent === -1 || isNaN(exponent);

if (result[0] === ceil && e < 8 && autoExponent) {
  // Auto-increment logic
}
```

This pattern is used in:
- `filesize.js`: rounding-based auto-increment
- `filesize.js`: precision handling
- `helpers.js`: `calculateOptimizedValue()` bits auto-increment
- `helpers.js`: `applyPrecisionHandling()` scientific notation fix

### Forced Exponent Behavior

When `exponent` is explicitly set (not `-1` or `NaN`):
- Bits auto-increment is **disabled** in `calculateOptimizedValue()`
- Scientific notation normalization is **disabled** in `applyPrecisionHandling()`
- Rounding-based auto-increment is **disabled** in `filesize()`

Example:
```javascript
filesize(1024, { exponent: 0, bits: true }); // "8192 bit" (not auto-incremented to kbit)
filesize(1024, { exponent: 0 });             // "1024 B" (not auto-incremented to kB)
```

### Security

The library follows OWASP best practices and is secure for production use:

**Secure Patterns:**
- No `eval`, `Function` constructor, or command injection
- No prototype pollution (read-only symbol access, deep cloning in `partial()`)
- No XSS (returns plain strings only, no HTML/JS generation)
- No SSRF (no network requests)
- No ReDoS (simple regex, no catastrophic backtracking)
- Input validation on all user-provided values

**Security Considerations:**
- The `symbols` option allows user-controlled objects but only reads from them (safe)
- On Node.js <17, `partial()` uses JSON cloning which cannot serialize `NaN`/`Infinity` - throws clear error instead of silent data loss
- The `symbols` option allows user-controlled objects but only reads from them (safe)

**See `docs/TECHNICAL_DOCUMENTATION.md` for full security details.**

## Build System

The `ensureNewline()` plugin in `rollup.config.js` uses `generateBundle()` (not `renderChunk()`) to add trailing newlines. This preserves sourcemaps in minified builds by modifying the bundle after sourcemap generation.

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

### Formatting
Run `npm run format:fix` to format code with oxfmt.

### Build Output Files
Ensure output files end with newlines (configured in `rollup.config.js` with `ensureNewline()` plugin).

## Quick Reference

**Files to modify:**
- `src/filesize.js` - Main logic (95% of changes)
- `src/helpers.js` - Helper functions
- `src/constants.js` - Constants/lookup tables

**Commands:**
- `npm test` - Run everything
- `npm run build` - Build distributions
- `npm run lint` - Check code style
- `npm run format:fix` - Format code

**Key constraints:**
- No external dependencies
- 100% test coverage required
- JSDoc on all exported functions
- ES Modules only (no CommonJS in src/)
