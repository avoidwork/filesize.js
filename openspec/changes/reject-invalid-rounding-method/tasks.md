# Tasks

## 1. Core Implementation

- [ ] 1.1 Add whitelist validation for `roundingMethod` in `src/filesize.js` and verify `filesize(1536, {roundingMethod: "sqrt"})` throws `TypeError: Invalid rounding method`
- [ ] 1.2 Add unit tests for `"sqrt"` and `"abs"` throwing `TypeError` in `tests/unit/filesize.test.js` and verify the new tests pass

## 2. Verification

- [ ] 2.1 Run `npm test` and verify the full suite passes with 100% coverage
- [ ] 2.2 Run `npm run build` and verify the build succeeds

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
