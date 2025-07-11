# Code Style Guide

## Table of Contents

1. [Overview](#overview)
2. [General Principles](#general-principles)
3. [Code Formatting](#code-formatting)
4. [Naming Conventions](#naming-conventions)
5. [Function and Class Design](#function-and-class-design)
6. [Documentation Standards](#documentation-standards)
7. [Error Handling](#error-handling)
8. [Module Structure](#module-structure)
9. [Testing Standards](#testing-standards)
10. [Security Guidelines](#security-guidelines)
11. [Performance Considerations](#performance-considerations)
12. [Tools and Linting](#tools-and-linting)

## Overview

This style guide establishes coding standards for the filesize.js project, following Node.js community best practices and ensuring code maintainability, readability, and security.

## General Principles

### Core Development Principles

- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through abstraction and modularization
- **KISS (Keep It Simple, Stupid)**: Favor simplicity over complexity
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when necessary
- **SOLID Principles**: Follow Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles

### Code Quality Standards

- Write self-documenting code with clear intent
- Prioritize code readability over cleverness
- Use meaningful names that express intent
- Keep functions small and focused
- Write testable code with minimal dependencies

## Code Formatting

### Indentation and Spacing

```javascript
// Use tabs for indentation (project standard)
function exampleFunction(param1, param2) {
	const result = param1 + param2;
	return result;
}

// Space around operators
const sum = a + b;
const isValid = value > 0 && value < 100;

// Space after commas in arrays and objects
const array = [1, 2, 3, 4];
const obj = { key1: "value1", key2: "value2" };
```

### Line Length and Breaks

- Maximum line length: 120 characters
- Break long parameter lists across multiple lines
- Use consistent indentation for wrapped lines

```javascript
// Good: Long parameter list
function processData({
	inputData,
	outputFormat,
	processingOptions,
	validationRules
}) {
	// Function implementation
}

// Good: Long conditional
if (condition1 && 
	condition2 && 
	condition3) {
	// Action
}
```

### Trailing Commas

Use trailing commas in multi-line arrays and objects for cleaner diffs:

```javascript
const config = {
	option1: "value1",
	option2: "value2",
	option3: "value3", // Trailing comma
};
```

## Naming Conventions

### Variables and Functions

- Use **camelCase** for all variables and functions
- Use descriptive names that clearly indicate purpose
- Avoid abbreviations unless they are widely understood

```javascript
// Good
const userAccountBalance = getUserBalance();
const isValidEmail = validateEmailFormat(email);

// Bad
const usrAccBal = getUsrBal();
const isValidEml = validateEmlFmt(eml);
```

### Constants

- Use **UPPER_SNAKE_CASE** for all constants
- Group related constants together
- Use meaningful prefixes for constant categories

```javascript
// Good
const MAX_FILE_SIZE = 1024 * 1024;
const ERROR_INVALID_INPUT = "Invalid input provided";
const HTTP_STATUS_OK = 200;

// Export constants from dedicated module
export const STANDARDS = {
	IEC: "iec",
	JEDEC: "jedec",
	SI: "si"
};
```

### Files and Directories

- Use **kebab-case** for file and directory names
- Use descriptive names that indicate file purpose
- Group related files in logical directories

```
src/
├── constants.js
├── filesize.js
├── utils/
│   ├── validation-helpers.js
│   └── formatting-utils.js
tests/
├── unit/
│   ├── filesize.test.js
│   └── constants.test.js
└── integration/
    └── full-workflow.test.js
```

## Function and Class Design

### Function Structure

- Keep functions small (ideally under 20 lines)
- Single responsibility per function
- Pure functions when possible (no side effects)
- Use default parameters for optional arguments

```javascript
/**
 * Calculates the file size with specified formatting options
 * @param {number} bytes - The size in bytes
 * @param {Object} [options={}] - Formatting options
 * @param {string} [options.standard="jedec"] - Unit standard to use
 * @param {number} [options.precision=2] - Decimal places
 * @returns {string} Formatted file size string
 */
function formatFileSize(bytes, { 
	standard = "jedec", 
	precision = 2 
} = {}) {
	// Implementation
}
```

### Parameter Handling

- Use destructuring for options objects
- Provide sensible defaults
- Validate critical parameters

```javascript
// Good: Clear parameter destructuring with defaults
function processFile({
	inputPath,
	outputPath = "./output",
	format = "json",
	compress = false
} = {}) {
	if (!inputPath) {
		throw new TypeError("inputPath is required");
	}
	// Process file
}
```

### Return Values

- Be consistent with return types
- Return early for error conditions
- Use descriptive return objects when returning multiple values

```javascript
// Good: Consistent return pattern
function parseFileSize(input) {
	if (typeof input !== "string") {
		return { success: false, error: "Input must be a string" };
	}
	
	const parsed = parseSize(input);
	return { 
		success: true, 
		value: parsed.value, 
		unit: parsed.unit 
	};
}
```

## Documentation Standards

### JSDoc Requirements

All public functions and classes must have comprehensive JSDoc comments:

```javascript
/**
 * Converts bytes to human-readable format with specified options
 * @param {number|bigint} input - Number of bytes to convert
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.binary=false] - Use binary (1024) vs decimal (1000) calculation
 * @param {number} [options.precision=2] - Number of decimal places
 * @param {string} [options.standard="jedec"] - Unit standard (jedec, iec, si)
 * @param {string} [options.locale=""] - Locale for number formatting
 * @returns {string|Object|Array} Formatted file size
 * @throws {TypeError} When input is not a valid number
 * @throws {RangeError} When precision is negative
 * @example
 * // Basic usage
 * formatBytes(1024) // "1 KB"
 * 
 * // With options
 * formatBytes(1024, { binary: true, precision: 1 }) // "1.0 KiB"
 * 
 * // Object output
 * formatBytes(1024, { output: "object" }) 
 * // { value: 1, unit: "KB", symbol: "KB" }
 */
function formatBytes(input, options = {}) {
	// Implementation
}
```

### Inline Comments

- Use comments sparingly for complex logic
- Explain "why" not "what"
- Keep comments up-to-date with code changes

```javascript
// Calculate exponent based on logarithm
// This handles edge cases where Math.log returns unexpected values
const exponent = Math.max(0, Math.floor(Math.log(bytes) / Math.log(base)));
```

### README Documentation

- Include clear installation instructions
- Provide comprehensive API documentation
- Include practical examples
- Document all configuration options

## Error Handling

### Error Types and Messages

- Use specific error types for different error conditions
- Provide clear, actionable error messages
- Include context in error messages

```javascript
// Good: Specific error handling
function validateInput(value) {
	if (typeof value !== "number" && typeof value !== "bigint") {
		throw new TypeError(
			`Expected number or bigint, received ${typeof value}`
		);
	}
	
	if (value < 0) {
		throw new RangeError(
			`Value must be non-negative, received ${value}`
		);
	}
}
```

### Error Constants

Define error messages as constants to ensure consistency:

```javascript
// constants.js
export const ERRORS = {
	INVALID_NUMBER: "Invalid number: expected number or bigint",
	INVALID_PRECISION: "Invalid precision: must be non-negative integer",
	INVALID_STANDARD: "Invalid standard: must be 'jedec', 'iec', or 'si'",
	INVALID_ROUNDING: "Invalid rounding method: method does not exist on Math object"
};
```

### Graceful Degradation

- Provide fallback behavior when possible
- Log warnings for recoverable errors
- Fail fast for critical errors

```javascript
function formatWithLocale(value, locale, options) {
	try {
		return value.toLocaleString(locale, options);
	} catch (error) {
		// Fallback to default formatting
		console.warn(`Locale formatting failed: ${error.message}`);
		return value.toString();
	}
}
```

## Module Structure

### ES6 Module Standards

- Use ES6 import/export syntax
- Prefer named exports over default exports for utilities
- Use default exports for main functionality

```javascript
// constants.js - Named exports for related constants
export const BYTE_SIZES = {
	KILOBYTE: 1024,
	MEGABYTE: 1024 * 1024,
	GIGABYTE: 1024 * 1024 * 1024
};

export const STANDARDS = {
	IEC: "iec",
	JEDEC: "jedec"
};

// filesize.js - Default export for main function
import { BYTE_SIZES, STANDARDS } from "./constants.js";

export default function filesize(bytes, options) {
	// Implementation
}

// Also provide named export
export { filesize };
```

### File Organization

- Separate concerns into different modules
- Keep related functionality together
- Use barrel exports for clean public APIs

```javascript
// index.js - Barrel export
export { default as filesize, filesize } from "./filesize.js";
export { partial } from "./partial.js";
export * from "./constants.js";
```

## Testing Standards

### Test Structure

- Use descriptive test names that explain behavior
- Group related tests with `describe` blocks
- Use `beforeEach`/`afterEach` for setup and cleanup

```javascript
import assert from "node:assert";
import { filesize } from "../src/filesize.js";

describe("filesize()", () => {
	describe("basic functionality", () => {
		it("should convert bytes to KB correctly", () => {
			const result = filesize(1024);
			assert.strictEqual(result, "1 KB");
		});
		
		it("should handle zero bytes", () => {
			const result = filesize(0);
			assert.strictEqual(result, "0 B");
		});
	});
	
	describe("error handling", () => {
		it("should throw TypeError for invalid input", () => {
			assert.throws(
				() => filesize("invalid"),
				{ name: "TypeError", message: /Invalid number/ }
			);
		});
	});
});
```

### Test Types

#### Unit Tests (`tests/unit/`)
- Test individual functions in isolation
- Mock external dependencies
- Focus on function behavior and edge cases
- Use node:assert for assertions

#### Integration Tests (`tests/integration/`)
- Test complete workflows
- Test module interactions
- Use real dependencies when appropriate
- Validate end-to-end functionality

### Test Coverage

- Aim for 90%+ code coverage
- Cover all public API methods
- Test error conditions and edge cases
- Use c8 for coverage reporting

```javascript
// Example comprehensive test
describe("filesize with options", () => {
	const testCases = [
		{ input: 1024, options: { binary: true }, expected: "1 KiB" },
		{ input: 1000, options: { binary: false }, expected: "1 KB" },
		{ input: 1536, options: { precision: 1 }, expected: "1.5 KB" }
	];
	
	testCases.forEach(({ input, options, expected }) => {
		it(`should return "${expected}" for ${input} bytes with options ${JSON.stringify(options)}`, () => {
			assert.strictEqual(filesize(input, options), expected);
		});
	});
});
```

## Security Guidelines

### Input Validation

Following OWASP security guidelines:

- Validate all inputs at entry points
- Sanitize user-provided data
- Use type checking for security-critical operations

```javascript
function secureFilesize(input, options = {}) {
	// Input validation
	if (typeof input !== "number" && typeof input !== "bigint") {
		throw new TypeError("Input must be a number or bigint");
	}
	
	// Validate numeric ranges
	if (typeof input === "number" && !Number.isFinite(input)) {
		throw new RangeError("Input must be a finite number");
	}
	
	// Validate options object
	if (options !== null && typeof options !== "object") {
		throw new TypeError("Options must be an object");
	}
	
	return formatFilesize(input, options);
}
```

### Dependency Security

- Regularly audit dependencies with `npm audit`
- Use specific version numbers in package.json
- Review security advisories for dependencies
- Minimize dependency count

### Data Sanitization

- Escape output for display contexts
- Validate object properties before use
- Use allow-lists for string values when possible

```javascript
const ALLOWED_STANDARDS = ["jedec", "iec", "si"];

function validateStandard(standard) {
	if (!ALLOWED_STANDARDS.includes(standard)) {
		throw new Error(`Invalid standard: ${standard}`);
	}
	return standard;
}
```

## Performance Considerations

### Optimization Guidelines

- Profile before optimizing
- Prefer readable code over premature optimization
- Cache expensive calculations when appropriate
- Use appropriate data structures for the task

```javascript
// Good: Efficient object lookup instead of array iteration
const UNIT_MULTIPLIERS = {
	B: 1,
	KB: 1024,
	MB: 1024 * 1024,
	GB: 1024 * 1024 * 1024
};

function getMultiplier(unit) {
	return UNIT_MULTIPLIERS[unit] || 1;
}
```

### Memory Management

- Avoid memory leaks with proper cleanup
- Use `const` and `let` appropriately
- Minimize object creation in hot paths

```javascript
// Good: Reuse objects when possible
const formatOptions = {
	minimumFractionDigits: 0,
	maximumFractionDigits: 2
};

function formatNumber(value, precision = 2) {
	formatOptions.maximumFractionDigits = precision;
	return value.toLocaleString("en-US", formatOptions);
}
```

## Tools and Linting

### ESLint Configuration

The project uses ESLint for code quality enforcement. Key rules include:

- Consistent indentation (tabs)
- Semicolon usage
- Quote style consistency
- Unused variable detection
- Function complexity limits

### Development Workflow

1. **Linting**: Run `npm run lint` before committing
2. **Auto-fixing**: Use `npm run fix` for automatic fixes
3. **Testing**: Run `npm test` for full test suite
4. **Coverage**: Review coverage reports with c8

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:

- Lint all staged files
- Run tests
- Validate commit message format

### Recommended VS Code Extensions

- ESLint
- Prettier (if configured)
- JavaScript (ES6) code snippets
- Path Intellisense
- GitLens

## Code Review Guidelines

### Review Checklist

- [ ] Code follows established patterns
- [ ] Functions have appropriate JSDoc documentation
- [ ] Error handling is comprehensive
- [ ] Tests cover new functionality
- [ ] No security vulnerabilities introduced
- [ ] Performance implications considered
- [ ] Breaking changes documented

### Review Process

1. **Self-review**: Author reviews their own changes first
2. **Peer review**: At least one other developer reviews
3. **Testing**: All tests pass in CI/CD
4. **Documentation**: Updates made to relevant docs

---

## Conclusion

This style guide serves as the foundation for consistent, maintainable, and secure code in the filesize.js project. Regular updates to this guide should reflect evolving best practices and project needs.

For questions or suggestions regarding this style guide, please open an issue in the project repository. 