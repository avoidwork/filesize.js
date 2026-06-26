## Context

filesize.js is a lightweight, zero-dependency JavaScript utility for converting bytes to human-readable strings. The codebase has been optimized for performance with cached lookups and pre-computed values. An audit identified three issues: a padding logic bug in helpers.js, an isNaN clarity issue, and a JSON deep clone fragility in the partial function.

## Goals / Non-Goals

**Goals:**
- Fix the padding logic bug so excess decimal places are truncated when separator and pad options are combined
- Improve code clarity with isNaN(num) instead of isNaN(arg)
- Replace JSON deep clone with structuredClone for robustness

**Non-Goals:**
- No changes to the public API
- No changes to performance-critical paths beyond the bug fix
- No new dependencies or features

## Decisions

1. **Round before separator replacement** — The value must be rounded to `round` decimal places before the decimal point is replaced with the separator. This ensures the separator character doesn't interfere with truncation. Alternative (truncate after separator) was rejected because it would require distinguishing the decimal separator from grouping separators.

2. **structuredClone with JSON fallback** — `structuredClone` is available in Node 17+, but the package supports Node 10.8.0+. We'll use `structuredClone` with a fallback to `JSON.parse(JSON.stringify())` for older versions. This preserves compatibility while using the modern API when available.

3. **No breaking changes** — All fixes are backward compatible. The padding bug fix changes behavior only for the specific edge case where separator and pad are both set with excess decimal places.

## Risks / Trade-offs

- [Risk] Rounding before separator replacement could affect values that rely on the current (buggy) behavior → [Mitigation] The current behavior is incorrect per the documented `round` parameter, so fixing it is the right call. Tests will catch any regressions.
- [Risk] structuredClone fallback adds code complexity → [Mitigation] The fallback is a simple ternary: `typeof structuredClone === 'function' ? structuredClone(obj) : JSON.parse(JSON.stringify(obj))`

## Open Questions

- None. The audit findings are clear and the fixes are straightforward.
