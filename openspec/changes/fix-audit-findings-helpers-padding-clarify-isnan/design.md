## Context

The filesize.js library converts byte counts to human-readable strings. An audit (issue #296) identified three findings in the source code: a medium-severity bug in the padding logic when custom separators are used, a low-severity clarity issue with isNaN, and a low-severity fragility issue with JSON-based deep cloning in the partial function.

Current state: The codebase uses a modular structure with `src/filesize.js` (main entry), `src/helpers.js` (utility functions), and `src/constants.js` (shared constants). The project targets Node.js >= 10.8.0 and uses ESM modules.

## Goals / Non-Goals

**Goals:**
- Fix the padding truncation bug in `applyNumberFormatting` when separator and pad are both set
- Clarify the isNaN check in the filesize function
- Replace JSON-based deep clone with a safer approach in the partial function

**Non-Goals:**
- Refactoring other helper functions
- Adding new features or options
- Changing the public API or breaking existing behavior (except correcting the padding bug)
- Adding new dependencies

## Decisions

### Decision 1: Truncate decimals before padding in helpers.js
**Choice:** Truncate the decimal portion to `round` digits before calling `padEnd`, in the non-locale path of `applyNumberFormatting`.
**Rationale:** The locale formatting path already handles precision via `minimumFractionDigits`/`maximumFractionDigits`. The non-locale path (separator + pad) needs explicit truncation because `padEnd` only appends zeros — it never removes excess digits.
**Alternatives considered:**
- Round the numeric value before string conversion — but this could introduce floating point artifacts and doesn't work cleanly with custom separators.
- Use `toFixed(round)` — but this doesn't work with custom separators since it always uses `.` as decimal point.

### Decision 2: Use structuredClone with fallback for deep cloning
**Choice:** Use `structuredClone` when available (Node.js 17+), fall back to a simple recursive clone for plain objects/arrays on older versions.
**Rationale:** `structuredClone` is the modern, standards-based approach. The fallback handles the current use case (plain objects/arrays from user options) without adding a dependency. Since filesize.js targets Node.js >= 10.8.0, the fallback is necessary.
**Alternatives considered:**
- Add a deep clone library (e.g., lodash.clonedeep) — adds dependency, against the project's zero-dependency philosophy.
- Always use JSON.parse(JSON.stringify()) — keeps it simple but retains the fragility.

### Decision 3: isNaN clarity change is standalone
**Choice:** Simple one-line replacement of `isNaN(arg)` with `isNaN(num)`.
**Rationale:** No behavioral change, no test changes needed. Pure clarity improvement.

## Risks / Trade-offs

- [Padding fix changes output for existing code relying on buggy behavior] → Mitigation: The buggy behavior was incorrect; correcting it is the right thing. Add test coverage to document expected behavior.
- [structuredClone fallback may not handle all edge cases] → Mitigation: The fallback only needs to handle plain objects/arrays (current use case). Document this limitation.
- [Node.js version compatibility] → Mitigation: structuredClone is available in Node.js 17+. The fallback ensures compatibility with older versions.

## Open Questions

None. All three findings have clear, actionable fixes.
