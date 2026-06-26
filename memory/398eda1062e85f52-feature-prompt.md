CHANGE_NAME: fix-audit-findings-helpers-padding-clarify-isnan

## Summary

Fix three audit findings from issue #296 in the filesize.js codebase: a medium-severity bug in helpers.js where padding with a custom separator fails to truncate excess decimal places, a low-severity clarity issue in filesize.js where `isNaN(arg)` should reference the already-coerced `num` variable, and a low-severity fragility issue where `JSON.parse(JSON.stringify())` is used for deep cloning in the `partial` function.

## Technical Approach

### Finding 1: Padding with separator (helpers.js — medium)

The `applyNumberFormatting` function in `src/helpers.js` handles three formatting paths: locale formatting (when `locale` is true or a string), separator replacement (when `separator` is set), and padding (when `pad` is true). The bug occurs when both `separator` and `pad` are set: the separator replacement runs first, converting `.` to the custom separator (e.g., `,`), then the padding logic runs. However, the padding logic only calls `padEnd(round, ZERO)` on the decimal portion — it does not truncate excess digits. So `filesize(1234.567, {separator: ",", pad: true, round: 2})` produces `"1,234.567"` instead of `"1,234.57"`.

The fix: before applying `padEnd`, truncate the decimal portion to `round` digits. This should happen in the non-locale padding block (where `locale !== true && locale.length === 0`), after the separator replacement but before the `padEnd` call. The truncation logic should split on the separator, take the decimal portion, truncate it to `round` characters (or to `round` digits if it's numeric), and rejoin.

### Finding 2: isNaN clarity (filesize.js — low)

In the `filesize` function, after `num = Number(arg)`, the code checks `isNaN(arg)`. While functionally equivalent (both coerce to number and check for NaN), using `isNaN(num)` is clearer and more intentional — it checks the already-computed numeric value rather than the original argument. This is a one-line change with no behavioral impact.

### Finding 3: JSON deep clone fragility (filesize.js — low)

The `partial` function uses `JSON.parse(JSON.stringify())` to deep clone `localeOptions`, `symbols`, and `fullforms`. This works for plain objects and arrays but silently drops functions, undefined, Dates, RegExps, and circular references. Since the current use case only involves plain objects/arrays from user options, the risk is low, but a more robust approach would be preferable.

The fix: use `structuredClone` if available (Node.js 17+), with a fallback to a simple recursive clone for plain objects and arrays. Since filesize.js targets Node.js >= 10.8.0, the fallback is necessary. The fallback should handle the current use case (plain objects/arrays) without attempting to handle edge cases like functions or circular references.

## Architectural Decisions

- The padding fix is targeted to the non-locale path only, preserving the existing locale formatting behavior which handles precision differently.
- The isNaN change is purely cosmetic — no test changes needed.
- The deep clone replacement uses a feature-detection approach (`structuredClone` if available, fallback otherwise) to maintain backward compatibility with older Node.js versions while using the modern API when available.
