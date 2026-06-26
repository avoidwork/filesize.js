## 1. Fix padding truncation in helpers.js

- [ ] 1.1 Read applyNumberFormatting in src/helpers.js and identify the padding logic block
- [ ] 1.2 Add truncation of decimal portion to round digits before padEnd call, in the non-locale path
- [ ] 1.3 Write unit tests for padding with separator: truncate excess decimals, pad sufficient decimals, round 0 behavior
- [ ] 1.4 Verify existing padding and separator tests still pass

## 2. Clarify isNaN check in filesize.js

- [ ] 2.1 Replace isNaN(arg) with isNaN(num) in the filesize function
- [ ] 2.2 Add brief comment explaining why num is used instead of arg
- [ ] 2.3 Verify no test changes needed (no behavioral change)

## 3. Replace JSON deep clone in partial function

- [ ] 3.1 Implement a safe deep clone helper: use structuredClone if available, fallback to recursive clone for plain objects/arrays
- [ ] 3.2 Replace JSON.parse(JSON.stringify()) calls in partial function with the safe clone helper for localeOptions, symbols, and fullforms
- [ ] 3.3 Write unit tests for partial deep cloning: verify cloned objects are independent of originals
- [ ] 3.4 Verify existing partial tests still pass

## 4. Verification

- [ ] 4.1 Run full test suite (npm test)
- [ ] 4.2 Run linting (npm run lint)
- [ ] 4.3 Run coverage check (npm run coverage)
- [ ] 4.4 Verify all three audit findings are addressed
