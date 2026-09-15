# Task: Harden input validation and edge-case handling in filesize()

**Issue:** #343 — https://github.com/avoidwork/filesize.js/issues/343
**Repo:** avoidwork/filesize.js
**Branch:** `fix/harden-filesize-edge-cases`
**Status:** COMPLETE — all 10 root causes fixed, 255 tests pass, 100% coverage
**SKIP_OPENSPEC:** true (this project does not use OpenSpec for this work)

---

## Objective

Fix all 57 confirmed edge cases in `filesize()` across `src/filesize.js` and
`src/helpers.js`, add regression tests for every case, and maintain 100%
line/branch/function coverage.

---

## Source Files

- `src/filesize.js` — main function, BigInt handling, sign handling
- `src/helpers.js` — calculateExponent, resolveSymbol, decorateResult, applyRounding, applyNumberFormatting, formatOutput, applyPrecisionHandling
- `src/constants.js` — if needed

---

## Root Causes & Fix Steps

| # | Root cause | Fix |
|---|-----------|-----|
| RC1 | BigInt overflow: `filesize()` converts BigInt via `Number(arg)` at `src/filesize.js:77-79` but skips the `isFinite` check at line 86 | Apply the same `isFinite` check so overflowing BigInts throw `TypeError` | ✅ DONE |
| RC2 | Float exponent: `calculateExponent()` at `src/helpers.js:288-313` only handles `e === -1`/`isNaN` and `e < 0` | Reject or clamp non-integer positive exponents | ✅ DONE |
| RC3 | String exponent: `resolveSymbol()` at `src/helpers.js:356-369` uses strict `e === 1` | Coerce `e` to a number so string `"1"` matches the SI special case | ✅ DONE |
| RC4 | Negative fullform singular: `decorateResult()` at `src/helpers.js:445` uses `numericValue === 1` | Use `Math.abs(numericValue) === 1` so `-1` uses singular | ✅ DONE |
| RC5 | Sign loss on round-to-zero | Preserve sign consistently across precision and non-precision paths | ✅ DONE |
| RC6 | Precision out of range: `toPrecision()` at `src/helpers.js:195` no range validation | Validate `precision` is 1-100, throw clean `TypeError` | ✅ DONE |
| RC7 | Invalid output: `formatOutput()` at `src/helpers.js:468-489` only checks ARRAY/OBJECT | Throw `TypeError` for invalid `output` values | ✅ DONE |
| RC8 | Scientific notation leak in non-precision path | Ensure `Number.MAX_VALUE` and similar don't leak `e+` notation | ✅ DONE |
| RC9 | Coercion contract undocumented | Decide whether `null`/`true`/`false`/`""`/`[1000]`/hex/binary/octal strings are intended; document or validate | ✅ DONE (documented in JSDoc) |
| RC10 | Option precedence undocumented | Document `standard` > `base`, `fullform` > `symbols`, `locale` > `separator`, `fullforms` fallback | ✅ DONE (documented in JSDoc) |

---

## Edge Case Inventory (57 cases)

All confirmed against live code. Each needs a regression test.

### A. Input validation gaps

| # | Call | Observed | Expected |
|---|------|----------|----------|
| 1 | `filesize(BigInt("1" + "0".repeat(400)))` | `"Infinity YB"` | throw `TypeError` |
| 2 | `filesize(1000, { exponent: 1.5 })` | `"NaN undefined"` | throw `TypeError` or clamp |
| 3 | `filesize(1000, { exponent: "1" })` | `"1 KB"` | `"1 kB"` |
| 4 | `filesize(1000, { precision: 101 })` | raw `RangeError` | throw `TypeError` |
| 5 | `filesize(1000, { output: "foo" })` | `"1 kB"` | throw `TypeError` |
| 6 | `filesize("1_000")` | throw `TypeError` | document or parse |
| 7 | `filesize("1000n")` | throw `TypeError` | document or parse |
| 8 | `filesize(undefined)` | throw `TypeError` | document |

### B. Number() coercion matrix

| # | Input | Output |
|---|-------|--------|
| 9 | `filesize(null)` | `"0 B"` |
| 10 | `filesize(true)` | `"1 B"` |
| 11 | `filesize(false)` | `"0 B"` |
| 12 | `filesize("")` | `"0 B"` |
| 13 | `filesize(" ")` | `"0 B"` |
| 14 | `filesize([1000])` | `"1 kB"` |
| 15 | `filesize("0x1F")` | `"31 B"` |
| 16 | `filesize("0b101")` | `"5 B"` |
| 17 | `filesize("0o17")` | `"15 B"` |

### C. Sign / formatting inconsistencies

| # | Call | Observed | Expected |
|---|------|----------|----------|
| 18 | `filesize(-0.4)` | `"0 B"` | `"-0 B"` |
| 19 | `filesize(-0.4, { precision: 3 })` | `"-0.00 B"` | consistent |
| 20 | `filesize(-1, { fullform: true })` | `"-1 bytes"` | `"-1 byte"` |
| 21 | `filesize(-1, { fullform: true, precision: 3 })` | `"-1.00 bytes"` | `"-1.00 byte"` |
| 22 | `filesize(-0)` | `"0 B"` | `"-0 B"` or document |
| 23 | `filesize(Number.MAX_VALUE)` | `"1.797...e+284 YB"` | no scientific notation |
| 24 | `filesize(Number.MIN_VALUE)` | `"0 B"` | document |

### D. Option precedence interactions

| # | Call | Observed | Note |
|---|------|----------|------|
| 25 | `filesize(1024, { standard: "iec", base: 10 })` | `"1 KiB"` | `standard` wins |
| 26 | `filesize(1024, { standard: "si", base: 2 })` | `"1.02 kB"` | `standard` wins |
| 27 | `filesize(1000, { base: 8 })` | `"1 kB"` | base 8 falls to decimal |
| 28 | `filesize(1000, { base: 16 })` | `"1 kB"` | base 16 falls to decimal |
| 29 | `filesize(1000, { symbols: { kB: "kilobyte" }, fullform: true })` | `"1 kilobyte"` | `fullform` overrides `symbols` |
| 30 | `filesize(1536, { locale: "de-DE", separator: "_" })` | `"1,54 kB"` | `locale` overrides `separator` |
| 31 | `filesize(1536, { locale: true, separator: "_" })` | `"1.54 kB"` | `separator` ignored |
| 32 | `filesize(1000000, { fullform: true, fullforms: ["custom"] })` | `"1 megabyte"` | `fullforms[e]` undefined |

### E. Rounding boundary / non-integer options

| # | Call | Observed | Note |
|---|------|----------|------|
| 33 | `filesize(1536, { round: -1 })` | `"2 kB"` | negative round treated as 0 |
| 34 | `filesize(1536, { round: -1, pad: true })` | `"2 kB"` | same |
| 35 | `filesize(999.5, { round: 0 })` | `"1 kB"` | rounds to 1000, auto-increments |
| 36 | `filesize(999.999, { round: 2 })` | `"1 kB"` | rounds to 1000, auto-increments |
| 37 | `filesize(1000, { precision: 2.5 })` | `"1.0 kB"` | non-integer precision truncated |
| 38 | `filesize(0.4)` | `"0 B"` | sub-byte rounds to zero |
| 39 | `filesize(0.5)` | `"1 B"` | sub-byte rounds up |
| 40 | `filesize(1.4)` | `"1 B"` | rounds down |
| 41 | `filesize(1.5)` | `"2 B"` | rounds up |

### F. Bits auto-increment boundary

| # | Call | Observed | Note |
|---|------|----------|------|
| 42 | `filesize(125, { bits: true })` | `"1 kbit"` | auto-increments |
| 43 | `filesize(124, { bits: true })` | `"992 bit"` | below boundary |
| 44 | `filesize(125, { bits: true, exponent: 0 })` | `"1000 bit"` | forced exponent prevents increment |
| 45 | `filesize(124, { bits: true, exponent: 0 })` | `"992 bit"` | same |

### G. Precision value type in output

| # | Call | Observed | Note |
|---|------|----------|------|
| 46 | `filesize(1234567890, { precision: 2, output: "array" })` | `["1.2", "GB"]` | value is a string |
| 47 | `filesize(1234567890, { precision: 2, output: "object" })` | `{ value: "1.2", ... }` | value is a string |

### H. Custom fullforms with bits

| # | Call | Observed | Note |
|---|------|----------|------|
| 48 | `filesize(0.125, { bits: true, fullform: true, fullforms: ["", "custom-bit"] })` | `"1 bit"` | `fullforms[0]` empty |
| 49 | `filesize(1024, { bits: true, fullform: true, fullforms: ["", "customkbit"] })` | `"8.19 customkbit"` | custom applied |

### I. Negative + bits/fullform

| # | Call | Observed |
|---|------|----------|
| 50 | `filesize(-1000, { bits: true })` | `"-8 kbit"` |
| 51 | `filesize(-1000, { fullform: true, bits: true })` | `"-8 kilobits"` |

### J. Locale + localeOptions merge

| # | Call | Observed | Note |
|---|------|----------|------|
| 52 | `filesize(1536, { locale: true, localeOptions: { maximumFractionDigits: 1 } })` | `"1.54 kB"` | `localeOptions` ignored |
| 53 | `filesize(1536, { locale: "de-DE", localeOptions: { useGrouping: false }, pad: true, round: 2 })` | `"1,54 kB"` | |

### K. Symbol resolution edge cases

| # | Call | Observed | Note |
|---|------|----------|------|
| 54 | `filesize(1000, { symbols: {} })` | `"1 kB"` | empty symbols |
| 55 | `filesize(1000, { symbols: { MB: "megabyte" } })` | `"1 kB"` | non-matching key ignored |

### L. Spacer edge cases

| # | Call | Observed | Note |
|---|------|----------|------|
| 56 | `filesize(1000, { spacer: " - " })` | `"1 - kB"` | multi-char spacer |
| 57 | `filesize(1000, { spacer: "", output: "array" })` | `[1, "kB"]` | spacer ignored for array |

---

## Test Plan

- Add regression tests for every case (1-57) to `tests/unit/filesize.test.js`.
- Add targeted helper tests to `tests/unit/filesize-helpers.test.js` for `calculateExponent`, `resolveSymbol`, `applyRounding`, `applyNumberFormatting`.
- Follow existing style: `node:test`, `assert`, `describe`/`it`.

## Verification

- [ ] `npm run test` passes (runs lint + tests)
- [ ] `npm run coverage` maintains 100% line/branch/function coverage

## Git Workflow

1. Create branch: `fix/harden-filesize-edge-cases`
2. Commit (conventional): `fix: harden input validation and edge-case handling in filesize()`
3. Push to origin
4. Create PR targeting main (use `.github/PULL_REQUEST_TEMPLATE.md` if present, fill every section)
5. Enable auto-merge if appropriate

## Progress Tracker

- [ ] RC1: BigInt overflow
- [ ] RC2: Float exponent
- [ ] RC3: String exponent
- [ ] RC4: Negative fullform singular
- [ ] RC5: Sign loss on round-to-zero
- [ ] RC6: Precision out of range
- [ ] RC7: Invalid output
- [ ] RC8: Scientific notation leak
- [ ] RC9: Coercion contract
- [ ] RC10: Option precedence
- [ ] Tests for all 57 cases
- [ ] `npm run test` passes
- [ ] `npm run coverage` maintained
- [ ] Branch pushed
- [ ] PR created
