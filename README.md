# filesize
[![npm version](https://badge.fury.io/js/filesize.svg)](https://www.npmjs.com/package/filesize)
[![Node.js Version](https://img.shields.io/node/v/filesize.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Build Status](https://github.com/avoidwork/filesize.js/actions/workflows/ci.yml/badge.svg)](https://github.com/avoidwork/filesize.js/actions)

A lightweight, high-performance file size utility that converts bytes to human-readable strings. Zero dependencies. 100% test coverage.

## Why filesize?

- **Zero dependencies** - Pure JavaScript, no external packages
- **100% test coverage** - Reliable, well-tested codebase
- **TypeScript ready** - Full type definitions included
- **Multiple standards** - SI, IEC, and JEDEC support
- **Localization** - Intl API for international formatting
- **BigInt support** - Handle extremely large file sizes
- **Functional API** - Partial application for reusable formatters
- **Browser & Node.js** - Works everywhere

## Installation

```bash
npm install filesize
```

## TypeScript

Fully typed with TypeScript definitions included:

```typescript
import { filesize, partial } from 'filesize';

const result: string = filesize(1024);
const formatted: { value: number; symbol: string; exponent: number; unit: string } = filesize(1024, { output: 'object' });

const formatter: (arg: number | bigint) => string = partial({ standard: 'iec' });
```

## Usage

```javascript
import {filesize, partial} from "filesize";

filesize(1024); // "1.02 kB"
filesize(265318); // "265.32 kB"
filesize(1024, {standard: "iec"}); // "1 KiB"
filesize(1024, {bits: true}); // "8.19 kbit"
```

### Partial Application

```javascript
import {partial} from "filesize";

const formatBinary = partial({standard: "iec"});
formatBinary(1024); // "1 KiB"
formatBinary(1048576); // "1 MiB"
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bits` | boolean | `false` | Calculate bits instead of bytes |
| `base` | number | `-1` | Number base (2 for binary, 10 for decimal, -1 for auto) |
| `round` | number | `2` | Decimal places to round |
| `locale` | string\|boolean | `""` | Locale for formatting, `true` for system locale |
| `localeOptions` | Object | `{}` | Additional locale options |
| `separator` | string | `""` | Custom decimal separator |
| `spacer` | string | `" "` | Value-unit separator |
| `symbols` | Object | `{}` | Custom unit symbols |
| `standard` | string | `""` | Unit standard (`si`, `iec`, `jedec`) |
| `output` | string | `"string"` | Output format (`string`, `array`, `object`, `exponent`) |
| `fullform` | boolean | `false` | Use full unit names |
| `fullforms` | Array | `[]` | Custom full unit names |
| `exponent` | number | `-1` | Force specific exponent (-1 for auto) |
| `roundingMethod` | string | `"round"` | Math method (`round`, `floor`, `ceil`) |
| `precision` | number | `0` | Significant digits (0 for auto) |
| `pad` | boolean | `false` | Pad decimal places |

## Output Formats

```javascript
// String (default)
filesize(1536); // "1.54 kB"

// Array
filesize(1536, {output: "array"}); // [1.54, "kB"]

// Object
filesize(1536, {output: "object"});
// {value: 1.54, symbol: "kB", exponent: 1, unit: "kB"}

// Exponent
filesize(1536, {output: "exponent"}); // 1
```

## Standards

```javascript
// SI (default, base 10)
filesize(1000); // "1 kB"

// IEC (binary, requires base: 2)
filesize(1024, {base: 2, standard: "iec"}); // "1 KiB"

// JEDEC (binary calculation, traditional symbols)
filesize(1024, {standard: "jedec"}); // "1 KB"
```

## Examples

```javascript
// Bits
filesize(1024, {bits: true}); // "8.19 kbit"
filesize(1024, {bits: true, base: 2}); // "8 Kibit"

// Full form
filesize(1024, {fullform: true}); // "1.02 kilobytes"
filesize(1024, {base: 2, fullform: true}); // "1 kibibyte"

// Custom separator
filesize(265318, {separator: ","}); // "265,32 kB"

// Padding
filesize(1536, {round: 3, pad: true}); // "1.536 kB"

// Precision
filesize(1536, {precision: 3}); // "1.54 kB"

// Locale
filesize(265318, {locale: "de"}); // "265,32 kB"

// Custom symbols
filesize(1, {symbols: {B: "Б"}}); // "1 Б"

// BigInt support
filesize(BigInt(1024)); // "1.02 kB"

// Negative numbers
filesize(-1024); // "-1.02 kB"
```

## Error Handling

```javascript
try {
  filesize("invalid");
} catch (error) {
  // TypeError: "Invalid number"
}

try {
  filesize(1024, {roundingMethod: "invalid"});
} catch (error) {
  // TypeError: "Invalid rounding method"
}
```

## Testing

```bash
npm test              # Run all tests (lint + node:test)
npm run test:watch    # Live test watching
```

**100% test coverage** with 149 tests:

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 constants.js |     100 |      100 |     100 |     100 |                   
 filesize.js  |     100 |      100 |     100 |     100 |                   
 helpers.js   |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
```

## Development

```bash
npm install         # Install dependencies
npm run dev         # Development mode with live reload
npm run build       # Build distributions
npm run lint        # Check code style
npm run lint:fix    # Auto-fix linting issues
```

### Project Structure

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation (285 lines)
│   ├── helpers.js       # Helper functions (215 lines)
│   └── constants.js     # Constants (81 lines)
├── tests/
│   └── unit/
├── dist/                # Built distributions
└── types/               # TypeScript definitions
```

## Performance

- **Basic conversions**: ~16-27M ops/sec
- **With options**: ~5-13M ops/sec
- **Locale formatting**: ~91K ops/sec (use sparingly)

**Optimization tips:**
1. Cache `partial()` formatters for reuse
2. Avoid locale formatting in performance-critical code
3. Use `object` output for fastest structured data access

## Browser Usage

```html
<script src="https://cdn.jsdelivr.net/npm/filesize@11/dist/filesize.umd.min.js"></script>
<script>
  filesize(1024); // "1.02 kB"
</script>
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/avoidwork/filesize.js/blob/master/CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](https://github.com/avoidwork/filesize.js/blob/master/CHANGELOG.md) for a history of changes.

## License

Copyright (c) 2026 Jason Mulligan  
Licensed under the BSD-3 license.
