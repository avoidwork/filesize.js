# filesize.js

[![downloads](https://img.shields.io/npm/dt/filesize.svg)](https://www.npmjs.com/package/filesize)
[![npm version](https://badge.fury.io/js/filesize.svg)](https://badge.fury.io/js/filesize)
[![Node.js Version](https://img.shields.io/node/v/filesize.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Build Status](https://github.com/avoidwork/woodland/actions/workflows/ci.yml/badge.svg)](https://github.com/avoidwork/filesize.js/actions)

A lightweight, high-performance file size utility for JavaScript that converts bytes to human-readable strings. Works in both Node.js and browser environments with comprehensive format support.

## Installation

```bash
npm install filesize
```

## Usage

### ES Modules

```javascript
import {filesize} from "filesize";
filesize(265318, {standard: "jedec"}); // "259.1 KB"
```

### CommonJS

```javascript
const {filesize} = require("filesize");
filesize(1024); // "1.02 kB"
```

### Partial Application

```javascript
import {partial} from "filesize";
const size = partial({standard: "jedec"});
size(265318); // "259.1 KB"
```

## Parameters

* **input** `{Number|String|BigInt}` - The value to convert (required)
* **options** `{Object}` - Configuration object (optional)

### Options Object

* **base** `{Number}` - Number base, default is `10`
* **bits** `{Boolean}` - Enables `bit` sizes, default is `false`
* **exponent** `{Number}` - Specifies the symbol via exponent, e.g. `2` is `MB` for base 2, default is `-1`
* **fullform** `{Boolean}` - Enables full form of unit of measure, default is `false`
* **fullforms** `{Array}` - Array of full form overrides, default is `[]`
* **locale** `{String|Boolean}` - BCP 47 language tag to specify a locale, or `true` to use default locale, default is `""`
* **localeOptions** `{Object}` - Dictionary of options defined by ECMA-402 ([Number.prototype.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString))
* **output** `{String}` - Output of function (`array`, `exponent`, `object`, or `string`), default is `string`
* **pad** `{Boolean}` - Decimal place end padding, default is `false`
* **precision** `{Number}` - Sets precision of numerical output, default is `0`
* **round** `{Number}` - Decimal place, default is `2`
* **roundingMethod** `{String}` - Rounding method, can be `round`, `floor`, or `ceil`, default is `round`
* **separator** `{String}` - Decimal separator character, default is an empty string
* **spacer** `{String}` - Character between the `result` and `symbol`, default is `" "`
* **standard** `{String}` - Standard unit of measure, can be `iec`, `jedec`, or `si`. Default is `si` (base 10)
* **symbols** `{Object}` - Dictionary of IEC/JEDEC symbols to replace for localization

### Input Validation

The function validates input and throws `TypeError` for invalid values:

```javascript
// Invalid input will throw TypeError
try {
  filesize("invalid");
} catch (error) {
  console.error(error.message); // "Invalid input"
}

try {
  filesize(NaN);
} catch (error) {
  console.error(error.message); // "Invalid input"
}
```

## Testing

filesize.js maintains **100% test coverage** across all metrics with a comprehensive test suite of 47 test cases:

```console
-------------|---------|----------|---------|---------|-------------------
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------|---------|----------|---------|---------|-------------------
All files    |     100 |      100 |     100 |     100 |                   
 filesize.js |     100 |      100 |     100 |     100 |                   
-------------|---------|----------|---------|---------|-------------------
```

### Running Tests

```bash
# Run all tests (linting + unit tests)
npm test

# Run only unit tests
npm run mocha
```

### Test Coverage

The test suite comprehensively covers:

* **Basic functionality**: Core conversion logic and edge cases
* **Output formats**: All output types (string, array, object, exponent)
* **Standards support**: IEC, JEDEC, and SI standards with different bases
* **Bit conversion**: Bits vs bytes with auto-increment logic
* **Precision handling**: Rounding methods and decimal precision
* **Localization**: Locale formatting and custom symbols
* **Error handling**: Invalid inputs and boundary conditions
* **Partial functions**: All option combinations with curried functions

## Performance Benchmarks

filesize.js is optimized for high performance with comprehensive benchmarks covering various usage patterns:

### 🚀 Performance Overview

| Scenario | Operations/sec | Notes |
|----------|----------------|-------|
| **Basic conversion** | ~16-27M ops/sec | Fastest operations (large numbers) |
| **Small numbers** | ~18-20M ops/sec | Consistent performance |
| **With options** | ~5-13M ops/sec | Depends on option complexity |
| **Locale formatting** | ~91K ops/sec | Most expensive operation |
| **Stress testing** | ~2-10M ops/sec | Handles edge cases gracefully |

### 📊 Detailed Benchmark Results

#### Basic Performance (5-run average)
- **filesize(0)**: 18.6M ops/sec
- **filesize(512)**: 20.3M ops/sec
- **filesize(1024)**: 18.7M ops/sec  
- **filesize(1048576)**: 23.5M ops/sec
- **filesize(1073741824)**: 23.6M ops/sec
- **filesize(1099511627776)**: 26.9M ops/sec
- **With bits=true**: 16.8M ops/sec
- **With standard="iec"**: 16.6M ops/sec
- **With round=4**: 13.4M ops/sec

#### Options Performance Impact
- **bits=true**: 12.5M ops/sec
- **pad=true**: 5.6M ops/sec  
- **locale="en-US"**: 91K ops/sec (significant overhead)
- **standard="iec"**: 8.8M ops/sec
- **standard="jedec"**: 9.0M ops/sec
- **output="array"**: 10.2M ops/sec
- **output="object"**: 9.2M ops/sec
- **fullform=true**: 7.8M ops/sec
- **precision=3**: 6.3M ops/sec
- **separator=","**: 7.2M ops/sec

#### Stress Test Results
- **Edge cases**: 2.3M ops/sec (90% success rate)
- **Very large numbers**: 4.6M ops/sec (100% success)
- **Very small numbers**: 10.4M ops/sec (100% success)
- **Negative numbers**: 5.4M ops/sec (100% success)
- **Random options**: 2.3M ops/sec (100% success)
- **BigInt values**: 3.7M ops/sec (100% success)
- **Memory pressure**: 49K ops/sec (100% success)
- **Error conditions**: 715K ops/sec (~40% success rate)

#### Partial Function Performance
Partial functions maintain excellent performance with minimal overhead:
- **Acceptable overhead**: 1.1-1.4x slower for most configurations
- **Locale partials**: Significant overhead (~180x slower) due to locale formatting
- **Creation cost**: Amortized across multiple uses

### 💡 Performance Insights

**Excellent Performance (>10M ops/sec)**
- Basic conversions with minimal options
- Large number processing (1TB+ values)
- Standard output formats (string, array, object)
- IEC and JEDEC standards

**Good Performance (1-10M ops/sec)**  
- Complex option combinations
- Precision and rounding operations
- Fullform output
- Stress test scenarios

**Use Sparingly (<100K ops/sec)**
- Locale formatting (significant overhead ~91K ops/sec)
- Memory pressure conditions

### 🎯 Optimization Tips

1. **Cache partial functions** for repeated operations with same options
2. **Avoid locale formatting** in performance-critical code
3. **Use object output** for fastest structured data
4. **Batch similar operations** together
5. **Profile your specific usage patterns**

### Running Benchmarks

```bash
# Run all benchmarks
cd benchmarks && node index.js

# Run specific benchmark
node benchmarks/basic-performance.js

# With garbage collection (more accurate)
node --expose-gc benchmarks/index.js
```

### 🔥 Recent Performance Optimizations (v11.0.8)

The latest version includes significant performance improvements:

- **Pre-computed lookup tables** for Math operations (eliminates expensive `Math.pow()` calls)
- **Optimized base/standard logic** with reduced branching
- **Fast path for zero values** with minimal computation
- **Cached object property access** to reduce repeated lookups
- **Improved mathematical operations** with conditional calculations

**Overall performance improvement: 30-70% faster** across common use cases while maintaining full backward compatibility.

*Benchmarks run on macOS ARM64, Node.js v24.8.0, 12 CPU cores, 24GB RAM (5-run averages)*

## API Reference

### Functions

#### filesize(input, options)

Converts a numeric value to a human-readable file size string.

**Parameters:**

* `input` `{Number|String|BigInt}` - The value to convert
* `options` `{Object}` - Configuration options (optional)

**Returns:** `{String|Array|Object|Number}` - Formatted size based on output option

```javascript
filesize(500); // "500 B"
filesize(1024, {base: 2}); // "1 KiB"
filesize(265318, {output: "array"}); // [265.32, "kB"]
```

**See also:** partial()

#### partial(options)

Creates a pre-configured filesize function with options applied.

**Parameters:**

* `options` `{Object}` - Configuration options to apply

**Returns:** `{Function}` - New function with options pre-applied

```javascript
const formatBinary = partial({base: 2, standard: "iec"});
formatBinary(1048576); // "1 MiB"

const formatBits = partial({bits: true});
formatBits(1024); // "8.19 kbit"
```

**See also:** filesize()

### Output Formats

#### String Output (default)

```javascript
filesize(265318); // "265.32 kB"
filesize(265318, {separator: ","}); // "265,32 kB"
```

#### Array Output

```javascript
filesize(265318, {output: "array"}); // [265.32, "kB"]
filesize(1024, {output: "array", base: 2}); // [1, "KiB"]
```

#### Object Output

```javascript
filesize(265318, {output: "object"}); 
// {value: 265.32, symbol: "kB", exponent: 1, unit: "kB"}
```

#### Exponent Output

```javascript
filesize(1024, {output: "exponent"}); // 1
filesize(1048576, {output: "exponent", base: 2}); // 2
```

### Standards Support

#### SI (International System of Units) - Default

```javascript
filesize(1000); // "1 kB" (base 10)
filesize(1000000); // "1 MB"
```

#### IEC (International Electrotechnical Commission)

```javascript
filesize(1024, {standard: "iec", base: 2}); // "1 KiB"
filesize(1048576, {standard: "iec", base: 2}); // "1 MiB"
```

#### JEDEC (Joint Electron Device Engineering Council)

```javascript
filesize(1024, {standard: "jedec"}); // "1 KB"
filesize(1048576, {standard: "jedec"}); // "1 MB"
```

## Examples

### Basic Usage

```javascript
import {filesize} from "filesize";

filesize(500); // "500 B"
filesize(1024); // "1.02 kB"
filesize(265318); // "265.32 kB"
filesize(265318, {round: 0}); // "265 kB"
```

### Binary Formats

```javascript
// IEC binary prefixes (KiB, MiB, GiB)
filesize(1024, {base: 2, standard: "iec"}); // "1 KiB"
filesize(1048576, {base: 2, standard: "iec"}); // "1 MiB"

// JEDEC binary format (KB, MB, GB with binary calculation)
filesize(1024, {standard: "jedec"}); // "1 KB"
filesize(265318, {standard: "jedec"}); // "259.1 KB"
```

### Bits vs Bytes

```javascript
filesize(500, {bits: true}); // "4 kbit"
filesize(1024, {bits: true}); // "8.19 kbit"
filesize(1024, {bits: true, base: 2}); // "8 Kibit"
```

### Custom Formatting

```javascript
// Full form units
filesize(1024, {fullform: true}); // "1.02 kilobytes"
filesize(1024, {base: 2, fullform: true}); // "1 kibibyte"

// Custom separators and spacing
filesize(265318, {separator: ","}); // "265,32 kB"
filesize(265318, {spacer: ""}); // "265.32kB"

// Precision and padding
filesize(1536, {round: 3, pad: true}); // "1.536 kB"
filesize(1536, {precision: 3}); // "1.54 kB"
```

### Localization

```javascript
// German locale
filesize(265318, {locale: "de"}); // "265,32 kB"

// Custom symbols
filesize(1, {symbols: {B: "Б"}}); // "1 Б"

// Custom full forms
filesize(12, {fullform: true, fullforms: ["байтов"]}); // "12 байтов"
```

### Advanced Usage

```javascript
// Specific exponent
filesize(1024, {exponent: 0}); // "1024 B"
filesize(1024, {exponent: 1}); // "1.02 kB"

// BigInt support
filesize(BigInt(1024), {standard: "jedec"}); // "1 KB"

// Extreme precision for very large numbers
filesize(Math.pow(1024, 8), {precision: 3}); // "1.21 YB"
```

### Partial Application Patterns

```javascript
import {partial} from "filesize";

// Create specialized formatters
const formatBinary = partial({base: 2, standard: "iec"});
const formatBits = partial({bits: true});
const formatPrecise = partial({round: 3, pad: true});
const formatGerman = partial({locale: "de"});

// Use throughout application
formatBinary(1048576); // "1 MiB"
formatBits(1024); // "8.19 kbit"
formatPrecise(1536); // "1.536 kB"
formatGerman(265318); // "265,32 kB"

// Method chaining equivalent
const sizes = [1024, 2048, 4096];
sizes.map(formatBinary); // ["1 KiB", "2 KiB", "4 KiB"]
```

## Development

This project follows Node.js best practices and uses:

* **ES Modules** for modern JavaScript
* **Mocha** for testing with comprehensive coverage
* **ESLint** for code quality and consistency
* **Rollup** for building distributions
* **TypeScript definitions** for type safety

### Project Structure

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation
│   └── constants.js     # Unit definitions and constants
├── tests/
│   └── unit/
│       └── filesize.test.js  # Comprehensive test suite
├── types/
│   ├── filesize.d.ts    # TypeScript definitions
│   └── constants.d.ts   # Constants type definitions
└── package.json         # Dependencies and scripts
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Workflow

filesize.js includes an optimized development workflow with modern build tools:

* **🔄 Live Reload**: Use `npm run dev` for automatic rebuilds during development
* **📊 Bundle Analysis**: Monitor build sizes with `npm run build:analyze`
* **⚡ Fast Testing**: Live test running with `npm run test:watch`
* **🔧 Auto-fixing**: Automatic linting fixes with `npm run lint:fix`
* **📈 Performance**: Optimized Rollup configuration with enhanced tree shaking

**Build Output Analysis:**
- Minified ES Module: ~1.8KB (gzipped)
- UMD Bundle: ~1.9KB (gzipped)
- Comprehensive source maps included

### Development Commands

```bash
# Install dependencies
npm install

# Development mode with live rebuild
npm run dev

# Build distribution
npm run build

# Build with bundle size analysis
npm run build:analyze

# Live rebuild during development
npm run build:watch

# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run tests
npm test

# Live testing during development
npm run test:watch

# Run only unit tests
npm run mocha

# Bundle size analysis
npm run analyze:size

# Benchmarking
npm run benchmark
npm run benchmark:basic
npm run benchmark:stress
```

## License

Copyright (c) 2025 Jason Mulligan  
Licensed under the BSD-3 license.
