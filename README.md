# filesize
[![npm version](https://badge.fury.io/js/filesize.svg)](https://www.npmjs.com/package/filesize)
[![Node.js Version](https://img.shields.io/node/v/filesize.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Build Status](https://github.com/avoidwork/filesize.js/actions/workflows/ci.yml/badge.svg)](https://github.com/avoidwork/filesize.js/actions)

A lightweight, zero-dependency JavaScript utility that converts bytes to human-readable strings. A popular choice for client and server applications that need to display file sizes — from download counters to disk-usage reports.

## Why filesize?

- **Zero dependencies** — no install weight, no supply-chain surface.
- **100% test coverage** — every line, branch, and function is tested.
- **TypeScript ready** — full type definitions for options and return types.
- **Three unit standards** — SI, IEC, and JEDEC, each with its own symbols.
- **Localization** — Intl-based formatting for any locale.
- **BigInt support** — sizes beyond `Number.MAX_SAFE_INTEGER`.
- **Functional API** — `partial()` creates reusable, immutable formatters.
- **Client & server** — ships ESM, CJS, and UMD builds.

## Installation

```bash
npm install filesize
```

## Usage

```javascript
import {filesize, partial} from "filesize";

filesize(1024); // "1.02 kB"
filesize(265318); // "265.32 kB"
filesize(1024, {standard: "iec"}); // "1 KiB"
filesize(1024, {bits: true}); // "8.19 kbit"
```

### Partial application

`partial()` returns a pre-configured formatter with frozen options. Use it when you format many values with the same settings — it avoids re-parsing options on every call.

```javascript
import {partial} from "filesize";

const formatBinary = partial({standard: "iec"});
formatBinary(1024); // "1 KiB"
formatBinary(1048576); // "1 MiB"
```

## Standards

filesize supports three unit standards. They differ in two ways: the base (1000 or 1024) and the unit symbols.

| Standard | Base | Unit symbols | Example |
|----------|------|--------------|---------|
| SI | 1000 | kB, MB, GB | `filesize(1000)` → "1 kB" |
| IEC | 1024 | KiB, MiB, GiB | `filesize(1024, {standard: "iec"})` → "1 KiB" |
| JEDEC | 1024 | KB, MB, GB | `filesize(1024, {standard: "jedec"})` → "1 KB" |

When you set `standard`, the base is implied and `base` is ignored. `base` is only consulted when `standard` is not set.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bits` | boolean | `false` | Calculate bits instead of bytes |
| `base` | number | `-1` | Number base (2 for binary, 10 for decimal, -1 for auto). Ignored when `standard` is set |
| `round` | number | `2` | Decimal places to round to |
| `precision` | number | `0` | Significant digits (0 for auto). When set, overrides `round` |
| `pad` | boolean | `false` | Pad decimal places to match `round` |
| `locale` | string\|boolean | `""` | Locale for formatting; `true` for the system locale |
| `localeOptions` | Object | `{}` | Additional locale options |
| `separator` | string | `""` | Custom decimal separator |
| `spacer` | string | `" "` | Value-unit separator |
| `symbols` | Object | `{}` | Custom unit symbols |
| `standard` | string | `""` | Unit standard (`si`, `iec`, `jedec`) |
| `output` | string | `"string"` | Output format (`string`, `array`, `object`, `exponent`) |
| `fullform` | boolean | `false` | Use full unit names |
| `fullforms` | Array | `[]` | Custom full unit names |
| `exponent` | number | `-1` | Force a specific exponent (-1 for auto) |
| `roundingMethod` | string | `"round"` | Math method (`round`, `floor`, `ceil`) |

`round` controls decimal places; `precision` controls significant digits. When `precision` is greater than 0, it takes precedence over `round`.

## Output formats

```javascript
// String (default)
filesize(1536); // "1.54 kB"

// Array: [value, symbol]
filesize(1536, {output: "array"}); // [1.54, "kB"]

// Object: {value, symbol, exponent, unit}
filesize(1536, {output: "object"});
// {value: 1.54, symbol: "kB", exponent: 1, unit: "kB"}

// Exponent: the unit index
filesize(1536, {output: "exponent"}); // 1
```

## Examples

```javascript
// Bits
filesize(1024, {bits: true}); // "8.19 kbit"
filesize(1024, {bits: true, base: 2}); // "8 Kibit"

// Full unit names
filesize(1024, {fullform: true}); // "1.02 kilobytes"
filesize(1024, {base: 2, fullform: true}); // "1 kibibyte"

// Custom decimal separator
filesize(265318, {separator: ","}); // "265,32 kB"

// Padding
filesize(1536, {round: 3, pad: true}); // "1.536 kB"

// Significant digits
filesize(1536, {precision: 3}); // "1.54 kB"

// Locale
filesize(265318, {locale: "de"}); // "265,32 kB"

// Custom symbols
filesize(1, {symbols: {B: "Б"}}); // "1 Б"

// BigInt
filesize(BigInt(1024)); // "1.02 kB"

// Negative numbers
filesize(-1024); // "-1.02 kB"
```

## Error handling

`filesize()` throws a `TypeError` for invalid input.

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

Invalid input includes non-numeric values, `NaN`, `Infinity`, and BigInt values that overflow `Number.MAX_SAFE_INTEGER`.

## TypeScript

Fully typed with definitions included:

```typescript
import {filesize, partial} from "filesize";

const result: string = filesize(1024);
const formatted: {value: number; symbol: string; exponent: number; unit: string} = filesize(1024, {output: "object"});

const formatter: (arg: number | bigint) => string = partial({standard: "iec"});
```

## Testing

```bash
npm test              # Run all tests (lint + node:test)
npm run test:watch    # Live test watching
```

**100% test coverage** with 255 tests:

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
npm run dev         # Build distributions in watch mode
npm run build       # Build distributions
npm run lint        # Check code style
npm run fix         # Auto-fix linting issues
```

### Project structure

```
filesize.js/
├── src/
│   ├── filesize.js      # Main implementation (286 lines)
│   ├── helpers.js       # Helper functions (538 lines)
│   └── constants.js     # Constants (82 lines)
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

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/avoidwork/filesize.js/blob/master/CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](https://github.com/avoidwork/filesize.js/blob/master/CHANGELOG.md) for a history of changes.

## License

Copyright (c) 2026 Jason Mulligan  
Licensed under the BSD-3 license.
