## 1. Fix padding logic in helpers.js

- [ ] 1.1 Add rounding step in applyNumberFormatting before separator replacement when separator and pad are both set
- [ ] 1.2 Ensure rounding uses Math.round(value * p) / p where p = Math.pow(10, round)
- [ ] 1.3 Verify the fix doesn't break existing separator-only or pad-only behavior

## 2. Fix isNaN clarity in filesize.js

- [ ] 2.1 Replace isNaN(arg) with isNaN(num) in the filesize function

## 3. Replace JSON deep clone with structuredClone in partial function

- [ ] 3.1 Add typeof structuredClone check and use structuredClone when available, falling back to JSON.parse(JSON.stringify())
- [ ] 3.2 Apply the change to localeOptions, symbols, and fullforms cloning

## 4. Add tests

- [ ] 4.1 Add test for filesize(1234.567, {separator: ",", pad: true, round: 2}) returning "1,234.57"
- [ ] 4.2 Add test for filesize(1234.5678, {separator: ",", pad: true, round: 2}) returning "1,234.57"
- [ ] 4.3 Add test for partial function with structuredClone availability
- [ ] 4.4 Add test for partial function fallback behavior

## 5. Verify and commit

- [ ] 5.1 Run npm test to verify all tests pass
- [ ] 5.2 Run npm run lint to verify lint passes
- [ ] 5.3 Commit and push changes
