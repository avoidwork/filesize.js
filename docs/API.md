# API Reference

## Functions

### filesize(arg, options)

Converts a file size in bytes to a human-readable string with appropriate units.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `arg` | `number\|string\|bigint` | *(required)* | The file size in bytes to convert |
| `options` | `Object` | `{}` | Configuration options for formatting |

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bits` | `boolean` | `false` | If true, calculates bits instead of bytes |
| `pad` | `boolean` | `false` | If true, pads decimal places to match round parameter |
| `base` | `number` | `-1` | Number base (2 for binary, 10 for decimal, -1 for auto) |
| `round` | `number` | `2` | Number of decimal places to round to |
| `locale` | `string\|boolean` | `""` | Locale for number formatting, true for system locale |
| `localeOptions` | `Object` | `{}` | Additional options for locale formatting |
| `separator` | `string` | `""` | Custom decimal separator |
| `spacer` | `string` | `" "` | String to separate value and unit |
| `symbols` | `Object` | `{}` | Custom unit symbols |
| `standard` | `string` | `""` | Unit standard to use (`si`, `iec`, `jedec`) |
| `output` | `string` | `"string"` | Output format (`string`, `array`, `object`, `exponent`) |
| `fullform` | `boolean` | `false` | If true, uses full unit names instead of abbreviations |
| `fullforms` | `Array` | `[]` | Custom full unit names |
| `exponent` | `number` | `-1` | Force specific exponent (-1 for auto) |
| `roundingMethod` | `string` | `"round"` | Math rounding method to use (`round`, `floor`, `ceil`) |
| `precision` | `number` | `0` | Number of significant digits (0 for auto) |

**Returns:** `string\|Array\|Object\|number` - Formatted file size based on output option

**Throws:** `TypeError` - When arg is not a valid number or roundingMethod is invalid

**Examples:**

```javascript
// Basic usage
filesize(1024) // "1.02 kB"
filesize(265318) // "265.32 kB"

// Bits instead of bytes
filesize(1024, {bits: true}) // "8.19 kbit"

// Object output
filesize(1024, {output: "object"})
// {value: 1.02, symbol: "kB", exponent: 1, unit: "kB"}

// Binary standard (IEC)
filesize(1024, {base: 2, standard: "iec"}) // "1 KiB"

// Full form names
filesize(1024, {fullform: true}) // "1.02 kilobytes"

// Custom formatting
filesize(265318, {separator: ",", round: 0}) // "265 kB"

// Locale formatting
filesize(265318, {locale: "de"}) // "265,32 kB"

// BigInt support
filesize(BigInt(1024)) // "1.02 kB"

// Negative numbers
filesize(-1024) // "-1.02 kB"

// Exponent output
filesize(1536, {output: "exponent"}) // 1

// Array output
filesize(1536, {output: "array"}) // [1.54, "kB"]
```

---

### partial(options)

Creates a partially applied version of filesize with preset options.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Object` | `{}` | Configuration options (same as filesize) |

**Returns:** `Function` - A function that takes a file size and returns formatted output

**Examples:**

```javascript
import {partial} from "filesize";

// Create specialized formatters
const formatBinary = partial({base: 2, standard: "iec"});
const formatBits = partial({bits: true});
const formatPrecise = partial({round: 3, pad: true});
const formatGerman = partial({locale: "de"});

// Use throughout application
formatBinary(1024) // "1 KiB"
formatBinary(1048576) // "1 MiB"

formatBits(1024) // "8.19 kbit"

formatPrecise(1536) // "1.536 kB"

formatGerman(265318) // "265,32 kB"

// Method chaining
const sizes = [1024, 2048, 4096];
sizes.map(formatBinary) // ["1 KiB", "2 KiB", "4 KiB"]
```

---

## Output Formats

### String Output (default)

Returns a formatted string with value and unit separated by a space (or custom spacer).

```javascript
filesize(1536) // "1.54 kB"
filesize(265318, {separator: ","}) // "265,32 kB"
filesize(265318, {spacer: ""}) // "265.32kB"
```

### Array Output

Returns an array with `[value, symbol]`.

```javascript
filesize(1536, {output: "array"}) // [1.54, "kB"]
filesize(1024, {output: "array", base: 2}) // [1, "KiB"]
```

### Object Output

Returns an object with `value`, `symbol`, `exponent`, and `unit` properties.

```javascript
filesize(1536, {output: "object"})
// {value: 1.54, symbol: "kB", exponent: 1, unit: "kB"}
```

### Exponent Output

Returns the exponent as a number (0 = bytes, 1 = kB/KiB, 2 = MB/MiB, etc.).

```javascript
filesize(1536, {output: "exponent"}) // 1
filesize(1048576, {output: "exponent", base: 2}) // 2
```

---

## Unit Standards

### SI (International System of Units) - Default

Uses base 10 (powers of 1000) with SI symbols.

```javascript
filesize(1000) // "1 kB"
filesize(1000000) // "1 MB"
filesize(1000000000) // "1 GB"
```

### IEC (International Electrotechnical Commission)

Uses base 1024 (powers of 1024) with binary prefixes (KiB, MiB, GiB).

```javascript
filesize(1024, {base: 2, standard: "iec"}) // "1 KiB"
filesize(1048576, {base: 2, standard: "iec"}) // "1 MiB"
filesize(1073741824, {base: 2, standard: "iec"}) // "1 GiB"
```

### JEDEC

Uses base 1024 (powers of 1024) with traditional symbols (KB, MB, GB).

```javascript
filesize(1024, {standard: "jedec"}) // "1 KB"
filesize(1048576, {standard: "jedec"}) // "1 MB"
filesize(265318, {standard: "jedec"}) // "259.1 KB"
```

---

## Options Details

### bits

Calculate in bits instead of bytes.

```javascript
filesize(1024, {bits: true}) // "8.19 kbit"
filesize(1024, {bits: true, base: 2}) // "8 Kibit"
```

### base

Number base for calculations:
- `-1` (default): Auto-detect based on standard
- `2`: Binary (1024) - uses IEC symbols when combined with `standard: "iec"`
- `10`: Decimal (1000)

```javascript
filesize(1024, {base: 2}) // "1 KiB" (binary, IEC symbols)
filesize(1024, {base: 10}) // "1.02 kB" (decimal, SI symbols)
```

### round

Number of decimal places to round to.

```javascript
filesize(1536, {round: 0}) // "2 kB"
filesize(1536, {round: 1}) // "1.5 kB"
filesize(1536, {round: 3}) // "1.536 kB"
```

### pad

Pad decimal places with zeros to match the `round` parameter.

```javascript
filesize(1536, {round: 3, pad: true}) // "1.536 kB"
filesize(1024, {round: 3, pad: true}) // "1.020 kB"
```

### separator

Custom decimal separator character.

```javascript
filesize(265318, {separator: ","}) // "265,32 kB"
filesize(265318, {separator: "."}) // "265.32 kB"
```

### spacer

Character between the result and symbol.

```javascript
filesize(265318, {spacer: ""}) // "265.32kB"
filesize(265318, {spacer: "-"}) // "265.32-kB"
```

### symbols

Custom unit symbols for localization or branding.

```javascript
filesize(1, {symbols: {B: "Б"}}) // "1 Б"
filesize(1024, {symbols: {kB: "KB"}}) // "1.02 KB"
```

### standard

Unit standard to use:
- `""` (default): SI standard (base 10)
- `"si"`: SI standard (base 10)
- `"iec"`: IEC standard (base 1024, KiB/MiB/GiB)
- `"jedec"`: JEDEC standard (base 1024, KB/MB/GB)

```javascript
filesize(1024, {standard: "si"}) // "1.02 kB"
filesize(1024, {standard: "iec"}) // "1 KiB"
filesize(1024, {standard: "jedec"}) // "1 KB"
```

### output

Output format:
- `"string"` (default): Human-readable string
- `"array"`: `[value, symbol]`
- `"object"`: `{value, symbol, exponent, unit}`
- `"exponent"`: Number (exponent value)

```javascript
filesize(1536, {output: "string"}) // "1.54 kB"
filesize(1536, {output: "array"}) // [1.54, "kB"]
filesize(1536, {output: "object"}) // {value: 1.54, symbol: "kB", exponent: 1, unit: "kB"}
filesize(1536, {output: "exponent"}) // 1
```

### fullform

Use full unit names instead of abbreviations.

```javascript
filesize(1024, {fullform: true}) // "1.02 kilobytes"
filesize(1024, {base: 2, fullform: true}) // "1 kibibyte"
filesize(1024, {bits: true, fullform: true}) // "8.19 kilobits"
```

### fullforms

Custom full unit names array (overrides default full names).

```javascript
filesize(12, {fullform: true, fullforms: ["байт", "килобайт", "мегабайт"]})
// "12 килобайт"
```

### exponent

Force a specific exponent (-1 for auto).

```javascript
filesize(1024, {exponent: 0}) // "1024 B"
filesize(1024, {exponent: 1}) // "1.02 kB"
filesize(1024, {exponent: 2}) // "0.00 MB"
```

### roundingMethod

Math rounding method to use.

```javascript
filesize(1536, {roundingMethod: "round"}) // "1.54 kB"
filesize(1536, {roundingMethod: "floor"}) // "1.53 kB"
filesize(1536, {roundingMethod: "ceil"}) // "1.54 kB"
```

### precision

Number of significant digits (overrides round when specified).

```javascript
filesize(1536, {precision: 3}) // "1.54 kB"
filesize(1234567, {precision: 2}) // "1.2 MB"
```

### locale

Locale for number formatting:
- `""` (default): No locale formatting
- `true`: Use system locale
- `"en-US"`: Specific locale (BCP 47 language tag)

```javascript
filesize(265318, {locale: "en-US"}) // "265.32 kB"
filesize(265318, {locale: "de"}) // "265,32 kB"
filesize(265318, {locale: true}) // Uses system locale
```

### localeOptions

Additional options for `Intl.NumberFormat`.

```javascript
filesize(265318, {
  locale: "en-US",
  localeOptions: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
}) // "265.32 kB"
```

---

## Error Handling

Invalid input throws `TypeError`:

```javascript
try {
  filesize("invalid");
} catch (error) {
  console.error(error.message); // "Invalid number"
}

try {
  filesize(NaN);
} catch (error) {
  console.error(error.message); // "Invalid number"
}

try {
  filesize(1024, {roundingMethod: "invalid"});
} catch (error) {
  console.error(error.message); // "Invalid rounding method"
}
```

---

## Input Types

### Number

```javascript
filesize(1024) // "1.02 kB"
filesize(1536.5) // "1.54 kB"
filesize(-1024) // "-1.02 kB"
```

### String

```javascript
filesize("1024") // "1.02 kB"
filesize("1536.5") // "1.54 kB"
filesize("  1024  ") // "1.02 kB"
```

### BigInt

```javascript
filesize(BigInt(1024)) // "1.02 kB"
filesize(BigInt("10000000000000000000")) // "10 EB"
```
