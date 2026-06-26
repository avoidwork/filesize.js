# Feature Goals — Fix Audit Findings (Issue #296)

## Goal 1: Fix padding logic in helpers.js (medium severity)

**Scope:**
- **Included:** Fix `applyNumberFormatting` in `src/helpers.js` to truncate excess decimal places when both `separator` and `pad` options are set
- **Excluded:** Changes to locale formatting paths (locale=true or locale string), changes to rounding logic, changes to other helper functions

**Key Requirements:**
1. When `separator` is set and `pad` is true, the function must truncate excess decimal digits to match `round` before applying padding
2. The fix must handle the case where the value has more decimal places than `round` specifies (e.g., `1234.567` with `round: 2` → `1234.57`, then pad if needed)
3. The fix must not affect locale-formatted paths (locale=true or locale string) — those are handled separately
4. The fix must preserve existing behavior when `separator` is not set

**Acceptance Criteria:**
- `filesize(1234.567, {separator: ",", pad: true, round: 2})` returns `"1,234.57"` (not `"1,234.567"`)
- `filesize(1234.5, {separator: ",", pad: true, round: 2})` returns `"1,234.50"` (padding still works)
- `filesize(1234.567, {separator: ",", pad: false, round: 2})` returns `"1,234.57"` (no padding, but truncation still applies)
- Existing tests for padding and separator continue to pass

**Dependencies:**
- `src/helpers.js` — `applyNumberFormatting` function
- Existing test suite for padding and separator behavior

**Risks / Edge Cases:**
- Values with many decimal places (e.g., floating point artifacts like `1.0000000001`)
- Negative numbers with padding and separator
- Round values of 0 (should truncate all decimals)
- Interaction with `locale` option (locale formatting should remain unaffected)

---

## Goal 2: Clarify isNaN check in filesize.js (low severity)

**Scope:**
- **Included:** Change `isNaN(arg)` to `isNaN(num)` in the `filesize` function for clarity
- **Excluded:** Any logic changes, no behavioral modification

**Key Requirements:**
1. Replace `isNaN(arg)` with `isNaN(num)` after `num = Number(arg)` has been computed
2. The change is purely cosmetic — both are functionally equivalent in this context
3. Add a brief comment explaining why `num` is used instead of `arg`

**Acceptance Criteria:**
- Code reads `isNaN(num)` instead of `isNaN(arg)`
- No behavioral change — all existing tests pass
- Linting passes (oxlint/oxfmt)

**Dependencies:**
- `src/filesize.js` — `filesize` function

**Risks / Edge Cases:**
- None — this is a pure clarity improvement with no behavioral impact

---

## Goal 3: Replace JSON deep clone in partial function (low severity)

**Scope:**
- **Included:** Replace `JSON.parse(JSON.stringify())` with a safer deep clone approach in the `partial` function
- **Excluded:** Changes to other functions, changes to the partial function's API or behavior

**Key Requirements:**
1. Replace `JSON.parse(JSON.stringify(localeOptions))` with a safe deep clone that handles plain objects and arrays
2. Apply the same fix to `symbols` and `fullforms` cloning
3. The replacement must handle the current use case (plain objects/arrays from user options)
4. Consider using structuredClone (available in Node.js 17+) or a simple recursive clone for plain objects

**Acceptance Criteria:**
- `partial` function no longer uses `JSON.parse(JSON.stringify())`
- Deep cloned values are independent of the original options object
- All existing tests for `partial` continue to pass
- Linting passes (oxlint/oxfmt)

**Dependencies:**
- `src/filesize.js` — `partial` function
- Node.js 17+ has `structuredClone` available (filesize.js requires Node.js >= 10.8.0, so need a fallback)

**Risks / Edge Cases:**
- `structuredClone` is not available in Node.js < 17 — need a fallback for older versions
- The fallback should handle plain objects and arrays (current use case)
- Must not break existing behavior for any option type
