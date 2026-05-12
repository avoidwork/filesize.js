# AGENTS.md

Rules and principles for agents working on **this** project.

---

## 1. Core Rules

### 1.0 Document Conventions

When updating this document, append new information or sections. Do NOT delete or overwrite existing content unless explicitly directed. Always ask before making structural changes. When in doubt, keep it.

### 1.1 Forbidden Patterns

The following are **strictly prohibited**:

- Hardcoded secrets, API keys, or credentials.
- `eval()`, `Function` constructor, or command injection.
- `*` imports.
- Mutating a list while iterating over it.
- Prototype pollution (write-only symbol access).

### 1.2 Security Rules

Follow the [OWASP Top 10](https://owasp.org/www-project-top-10/) for every piece of code written:

- No XSS (returns plain strings only, no HTML/JS generation).
- No SSRF (no network requests).
- No ReDoS (simple regex, no catastrophic backtracking).
- Input validation on all user-provided values.
- The `symbols` option allows user-controlled objects but only reads from them (safe).

### 1.3 Git Operations

- **Never rebase under any circumstance without explicit agreement from the user.** Never assume your decision is correct.
- Never force push.

### 1.4 Core Principles

- **DRY**: Extract repeated logic into functions, classes, or utilities.
- **KISS**: Prefer simple, readable code over clever solutions.
- **YAGNI**: Do NOT build features, abstractions, or configurations not required by the current spec.
- **Single Responsibility**: Each module, class, and function must have one reason to change.

---

## 2. Project Context

filesize.js is a lightweight, high-performance file size utility that converts bytes to human-readable strings. It supports multiple unit standards (SI, IEC, JEDEC), localization, and various output formats.

### 2.0 Expected Project Layout

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation (filesize + partial)
│   ├── helpers.js       # Helper functions (5 exported functions)
│   └── constants.js     # Constants, symbols, lookup tables
├── tests/
│   └── unit/
│       ├── filesize-helpers.test.js  # Helper function tests
│       └── filesize.test.js          # Main function tests
├── dist/                # Built distributions (generated)
├── types/               # TypeScript definitions
└── docs/                # Documentation
```

**Key Facts:**
- **Single source file**: `src/filesize.js`
- **Helper functions**: `src/helpers.js`
- **Constants**: `src/constants.js`
- **Zero dependencies**: Uses only native JavaScript APIs
- **100% test coverage**: ~149 tests passing

### 2.1 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Full test suite (lint + node:test) |
| `npm run build` | Build all distributions |
| `npm run lint` | Check code style |
| `npm run fix` | Fix lint and format code |

---

## 3. JavaScript Conventions

### 3.1 Language & Tooling

- **JavaScript**: ES Modules (no CommonJS in src/)
- **Linting**: oxlint (fast Rust-based linter)
- **Formatting**: oxfmt (fast Rust-based formatter)
- **Testing**: `node:test` + node:assert with `--experimental-test-coverage`
- **Build**: rollup (produces CJS, ESM, UMD, minified outputs)

### 3.2 Style

- **JSDoc**: Use JSDoc standard for all functions and classes
- **Functions**: camelCase (`handleZeroValue`, `applyPrecisionHandling`)
- **Constants**: UPPER_SNAKE_CASE (`IEC`, `JEDEC`, `BINARY_POWERS`)
- All exported functions MUST have JSDoc documentation.

### 3.3 Error Handling

- Raise typed errors. `filesize("invalid")` throws `TypeError: "Invalid number"`.
- No `eval`, `Function` constructor, or command injection.

### 3.4 Testing

- Unit tests live in `tests/unit/`.
- Use `describe()` and `it()` from `node:test`.
- Each public function or class must have at least one test.
- **100%** statement, branch, function, and line coverage required.

### 3.5 Code Style Template

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

---

## 4. Core Architecture

### 4.1 Data Flow

```
Input → Validation → Standard Normalization → Exponent Calculation 
→ Value Conversion → Formatting → Output Generation
```

### 4.2 Key Components

1. **`filesize(arg, options)`**: Orchestrator — delegates validation, exponent, value calc, rounding, formatting, and output dispatch
2. **`partial(options)`**: Creates pre-configured formatter with immutable frozen options
3. **`handleZeroValue()`**: Special handling for zero input
4. **`calculateOptimizedValue()`**: Core conversion logic with bits handling
5. **`applyPrecisionHandling()`**: Precision + scientific notation correction
6. **`applyNumberFormatting()`**: Locale, separator, padding
7. **`getBaseConfiguration()`**: Cached base/standard lookup table
8. **`calculateExponent()`**: Log-based exponent calculation with clamping
9. **`applyRounding()`**: Rounding + auto-increment ceiling adjustment
10. **`resolveSymbol()`**: Symbol table lookup with SI override for e=1
11. **`decorateResult()`**: Negation, custom symbols, full form assembly
12. **`formatOutput()`**: Array/object/string output dispatch

### 4.3 Standard Selection

- **SI (default)**: Base 10, uses JEDEC symbols (kB, MB, GB)
- **IEC**: Base 1024, binary prefixes (KiB, MiB, GiB)
- **JEDEC**: Base 1024, uses traditional symbols (KB, MB, GB)

---

## 5. API Reference

### 5.1 Options Object

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

### 5.2 Output Formats

- **string**: `"1.5 KB"` (default)
- **array**: `[1.5, "KB"]`
- **object**: `{value: 1.5, symbol: "KB", exponent: 1, unit: "KB"}`
- **exponent**: `1`

### 5.3 Creating Formatters

```javascript
import { partial } from 'filesize';

const formatBinary = partial({base: 2, standard: "iec"});
const formatBits = partial({bits: true});
const formatPrecise = partial({round: 3, pad: true});
```

### 5.4 Modifying `partial()`

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

---

## 6. Common Patterns

### 6.1 Padding with Negative Numbers

When using `pad: true` with negative numbers, the decimal separator detection must skip the minus sign:
```javascript
// Correct: slice(1) to skip minus sign
const x = separator || (resultStr.slice(1).match(/(\D)/g) || []).pop() || PERIOD;
```

Without this, `-1.00` would split on `-` instead of `.`, producing incorrect output like `-10 kB` instead of `-1.00 kB`.

### 6.2 BigInt Support

```javascript
filesize(BigInt(1024)); // "1.02 kB"
filesize(BigInt("10000000000000000000")); // Works with huge numbers
```

### 6.3 Auto-Exponent Pattern

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

### 6.4 Forced Exponent Behavior

When `exponent` is explicitly set (not `-1` or `NaN`):
- Bits auto-increment is **disabled** in `calculateOptimizedValue()`
- Scientific notation normalization is **disabled** in `applyPrecisionHandling()`
- Rounding-based auto-increment is **disabled** in `filesize()`

Example:
```javascript
filesize(1024, { exponent: 0, bits: true }); // "8192 bit" (not auto-incremented to kbit)
filesize(1024, { exponent: 0 });             // "1024 B" (not auto-incremented to kB)
```

### 6.5 JSDoc Template

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

---

## 7. Git Conventions

### 7.1 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new output format option
fix: correct rounding on negative pad values
docs: update AGENTS.md with new patterns
test: add coverage for bits auto-increment
chore: update rollup config
```

**Commit Message Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code restructuring
- `build`: Build system changes
- `test`: Test additions/fixes

### 7.2 Branching

- Feature branches: `feat/<short-desc>` or `fix/<short-desc>`.
- Never commit directly to `main` or `master`. Always create a feature branch first, then open a PR targeting `master`.

### 7.3 Agent Workflow

When auditing or modifying AGENTS.md (or any file):
1. Create a feature branch: `git checkout -b docs/<short-desc>` (or `feat/`, `fix/`).
2. Make changes and commit on the feature branch.
3. Push the feature branch and open a PR with `gh pr create --base master`.
4. Never commit or push directly to `main` or `master`.

### 7.4 Pull Request Templates

If a `.github/PULL_REQUEST_TEMPLATE.md` file exists, it MUST be used when creating PRs. Fill out every section — do not leave any section blank. If a section does not apply, write `N/A` rather than skipping it.

---

## 8. Operational Rules

### 8.1 Coverage

The test runner enforces **100% code coverage** via `--experimental-test-coverage`. Every new function or class needs test coverage. No exceptions.

```bash
npm test              # Full test suite (lint + node:test with coverage)
npm run test:watch    # Live test watching
```

### 8.2 Build Process

```bash
npm run build         # Build all distributions
npm run dev           # Development mode with live reload
npm run build:watch   # Watch mode
npm run build:analyze # Bundle size analysis
```

**Distribution Files:**
- `dist/filesize.cjs` - CommonJS
- `dist/filesize.js` - ES Module
- `dist/filesize.min.js` - Minified ES Module
- `dist/filesize.umd.js` - UMD (browser)
- `dist/filesize.umd.min.js` - Minified UMD

**Build System**: The `ensureNewline()` plugin in `rollup.config.js` uses `generateBundle()` (not `renderChunk()`) to add trailing newlines. This preserves sourcemaps in minified builds by modifying the bundle after sourcemap generation.

### 8.3 Performance

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

---

## 9. Checklist Before Marking a TODO Complete

- [ ] JSDoc on all exported functions
- [ ] Unit tests written and passing
- [ ] 100% code coverage maintained
- [ ] `npm test` passes (lint + tests)
- [ ] `npm run build` succeeds
- [ ] No hardcoded secrets or credentials introduced
- [ ] Zero external dependencies added
- [ ] ES Modules only (no CommonJS in src/)
