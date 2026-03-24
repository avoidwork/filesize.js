# Code Style Guide

## Overview

This style guide establishes coding standards for filesize.js, following Node.js community best practices and the project's existing patterns.

## General Principles

- **DRY (Don't Repeat Yourself)**: Eliminate code duplication
- **KISS (Keep It Simple, Stupid)**: Favor simplicity over complexity
- **YAGNI (You Aren't Gonna Need It)**: Implement only when necessary
- **SOLID Principles**: Follow single responsibility, etc.

## Code Formatting

### Indentation

Use **tabs** for indentation:

```javascript
export function filesize (arg, {
	bits = false,
	pad = false
} = {}) {
	const result = [];
	return result;
}
```

### Line Length

- Maximum line length: 120 characters
- Break long parameter lists across multiple lines

### Trailing Commas

Use trailing commas in multi-line arrays/objects:

```javascript
const config = {
	option1: "value1",
	option2: "value2",
};
```

## Naming Conventions

### Functions and Variables

Use **camelCase**:

```javascript
// Good
const userAccountBalance = getUserBalance();
const isValidEmail = validateEmailFormat(email);

// From filesize.js
export function handleZeroValue (precision, actualStandard, bits) {
	// Implementation
}
```

### Constants

Use **UPPER_SNAKE_CASE**:

```javascript
// From constants.js
export const INVALID_NUMBER = "Invalid number";
export const IEC = "iec";
export const BINARY_POWERS = [1, 1024, 1048576];
```

### Files and Directories

Use **kebab-case** for file/directory names. The project uses simple descriptive names:

```
src/
├── constants.js
├── filesize.js
└── helpers.js

tests/
├── unit/
│   └── filesize-helpers.test.js
└── integration/
    └── filesize.test.js
```

## Function Design

### Small, Focused Functions

Keep functions small with single responsibility:

```javascript
/**
 * Optimized base configuration lookup
 * @param {string} standard - Standard type
 * @param {number} base - Base number
 * @returns {Object} Configuration object
 */
export function getBaseConfiguration (standard, base) {
	if (STANDARD_CONFIGS[standard]) {
		return STANDARD_CONFIGS[standard];
	}

	if (base === 2) {
		return {isDecimal: false, ceil: 1024, actualStandard: IEC};
	}

	return {isDecimal: true, ceil: 1000, actualStandard: JEDEC};
}
```

### Default Parameters

Use default parameters for optional arguments:

```javascript
export function partial (options = {}) {
	return arg => filesize(arg, options);
}
```

### Early Returns

Return early for error conditions:

```javascript
if (typeof arg !== "bigint" && isNaN(arg)) {
	throw new TypeError(INVALID_NUMBER);
}

if (typeof roundingFunc !== FUNCTION) {
	throw new TypeError(INVALID_ROUND);
}
```

## Documentation Standards

### JSDoc Requirements

All exported functions must have JSDoc:

```javascript
/**
 * Converts a file size in bytes to a human-readable string
 * @param {number|string|bigint} arg - The file size in bytes
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.bits=false] - Calculate bits instead of bytes
 * @param {number} [options.round=2] - Decimal places to round to
 * @returns {string|Array|Object|number} Formatted file size
 * @throws {TypeError} When arg is not a valid number
 * @example
 * filesize(1024) // "1.02 kB"
 */
export function filesize (arg, options = {}) {
	// Implementation
}
```

### Comment Style

Use `//` for inline comments. Explain "why" not "what":

```javascript
// Fast path for zero
if (num === 0) {
	return handleZeroValue(precision, actualStandard, bits, symbols, full, fullforms, output, spacer);
}

// Optimized exponent calculation using pre-computed log values
if (e === -1 || isNaN(e)) {
	e = isDecimal ? Math.floor(Math.log(num) / LOG_10_1000) : Math.floor(Math.log(num) / LOG_2_1024);
}
```

## Error Handling

### Specific Error Types

Use specific error types with clear messages:

```javascript
if (typeof arg !== "bigint" && isNaN(arg)) {
	throw new TypeError(INVALID_NUMBER);
}

if (typeof roundingFunc !== FUNCTION) {
	throw new TypeError(INVALID_ROUND);
}
```

### Error Constants

Define error messages as constants:

```javascript
// constants.js
export const INVALID_NUMBER = "Invalid number";
export const INVALID_ROUND = "Invalid rounding method";
```

## Module Structure

### ES6 Modules

Use ES6 import/export syntax:

```javascript
// Import grouped by source, alphabetized
import {
	ARRAY,
	BIT,
	BITS,
	BYTE,
	BYTES,
	EMPTY,
	EXPONENT,
	FUNCTION,
	INVALID_NUMBER,
	INVALID_ROUND,
	LOG_10_1000,
	LOG_2_1024,
	OBJECT,
	ROUND,
	S,
	SI_KBIT,
	SI_KBYTE,
	SPACE,
	STRING,
	STRINGS,
} from "./constants.js";
import {
	applyNumberFormatting,
	applyPrecisionHandling,
	calculateOptimizedValue,
	getBaseConfiguration,
	handleZeroValue
} from "./helpers.js";
```

### Named Exports

Prefer named exports for utilities:

```javascript
export function filesize (arg, options = {}) {
	// Implementation
}

export function partial (options = {}) {
	return arg => filesize(arg, options);
}
```

## Testing Standards

### Test Structure

Use node-assert with mocha:

```javascript
import assert from "node:assert";
import { filesize } from "../../src/filesize.js";

describe("filesize()", () => {
	it("should convert bytes to human readable format", () => {
		const result = filesize(1024);
		assert.strictEqual(result, "1.02 kB");
	});
});
```

### Coverage Requirements

- **100%** statement, branch, function, and line coverage
- No uncovered lines allowed

## Security Guidelines

### Input Validation

Validate all inputs at entry points:

```javascript
if (typeof arg !== "bigint" && isNaN(arg)) {
	throw new TypeError(INVALID_NUMBER);
}
```

### No External Dependencies

The project has zero external dependencies - use only native JavaScript APIs.

## Performance Considerations

### Pre-computed Lookup Tables

Use lookup tables instead of runtime calculations:

```javascript
// Pre-computed lookup tables for performance optimization
export const BINARY_POWERS = [
	1, // 2^0
	1024, // 2^10
	1048576, // 2^20
	// ...
];

// Pre-computed log values for faster exponent calculation
export const LOG_2_1024 = Math.log(1024);
export const LOG_10_1000 = Math.log(1000);
```

### Fast Paths

Optimize common cases:

```javascript
// Fast path for zero
if (num === 0) {
	return handleZeroValue(precision, actualStandard, bits, symbols, full, fullforms, output, spacer);
}
```

## Tools

### Linting

Run before committing:

```bash
npm run lint     # Check code style
npm run lint:fix # Auto-fix issues
```

### Testing

```bash
npm test         # Full test suite (lint + mocha)
npm run mocha    # Tests only
npm run test:watch # Live test watching
```

### Building

```bash
npm run build         # Build all distributions
npm run build:watch   # Watch mode
npm run build:analyze # Bundle size analysis
```

---

This style guide reflects the actual patterns used in the filesize.js codebase.
