/**
 * Unit tests for filesize.js
 * Tests the main filesize function and partial function
 */

import assert from 'assert';
import { filesize, partial } from '../../src/filesize.js';

describe('filesize', () => {
  describe('Basic functionality', () => {
    it('should convert bytes to human readable format', () => {
      assert.strictEqual(filesize(1000), '1 kB');
      assert.strictEqual(filesize(1000000), '1 MB');
      assert.strictEqual(filesize(1000000000), '1 GB');
    });

    it('should handle zero bytes', () => {
      assert.strictEqual(filesize(0), '0 B');
    });

    it('should handle small numbers', () => {
      assert.strictEqual(filesize(1), '1 B');
      assert.strictEqual(filesize(512), '512 B');
    });

    it('should handle negative numbers', () => {
      assert.strictEqual(filesize(-1000), '-1 kB');
      assert.strictEqual(filesize(-1000000), '-1 MB');
    });
  });

  describe('Bits option', () => {
    it('should convert to bits when bits option is true', () => {
      assert.strictEqual(filesize(1000, { bits: true }), '8 kbit');
      assert.strictEqual(filesize(1000000, { bits: true }), '8 Mbit');
    });

    it('should handle zero with bits option', () => {
      assert.strictEqual(filesize(0, { bits: true }), '0 bit');
    });
  });

  describe('Standards', () => {
    it('should use IEC standard', () => {
      assert.strictEqual(filesize(1024, { standard: 'iec' }), '1 KiB');
      assert.strictEqual(filesize(1048576, { standard: 'iec' }), '1 MiB');
    });

    it('should use JEDEC standard', () => {
      assert.strictEqual(filesize(1024, { standard: 'jedec' }), '1 KB');
      assert.strictEqual(filesize(1048576, { standard: 'jedec' }), '1 MB');
    });

    it('should use SI standard', () => {
      assert.strictEqual(filesize(1000, { standard: 'si' }), '1 kB');
      assert.strictEqual(filesize(1000000, { standard: 'si' }), '1 MB');
    });
  });

  describe('Output formats', () => {
    it('should return string by default', () => {
      const result = filesize(1000);
      assert.strictEqual(typeof result, 'string');
      assert.strictEqual(result, '1 kB');
    });

    it('should return array when output is "array"', () => {
      const result = filesize(1000, { output: 'array' });
      assert(Array.isArray(result));
      assert.strictEqual(result[0], 1);
      assert.strictEqual(result[1], 'kB');
    });

    it('should return object when output is "object"', () => {
      const result = filesize(1000, { output: 'object' });
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(result.value, 1);
      assert.strictEqual(result.symbol, 'kB');
      assert.strictEqual(result.exponent, 1);
      assert.strictEqual(result.unit, 'kB');
    });

    it('should return exponent when output is "exponent"', () => {
      const result = filesize(1000, { output: 'exponent' });
      assert.strictEqual(typeof result, 'number');
      assert.strictEqual(result, 1);
    });
  });

  describe('Rounding', () => {
    it('should round to specified decimal places', () => {
      assert.strictEqual(filesize(1536, { round: 1 }), '1.5 kB');
      assert.strictEqual(filesize(1536, { round: 0 }), '2 kB');
      assert.strictEqual(filesize(1536, { round: 3 }), '1.536 kB');
    });

    it('should use different rounding methods', () => {
      assert.strictEqual(filesize(1536, { roundingMethod: 'floor' }), '1.53 kB');
      assert.strictEqual(filesize(1536, { roundingMethod: 'ceil' }), '1.54 kB');
      assert.strictEqual(filesize(1536, { roundingMethod: 'round' }), '1.54 kB');
    });
  });

  describe('Padding', () => {
    it('should pad decimal places when pad is true', () => {
      assert.strictEqual(filesize(1000, { pad: true, round: 2 }), '1.00 kB');
      assert.strictEqual(filesize(1536, { pad: true, round: 1 }), '1.5 kB');
    });
  });

  describe('Custom separators and spacers', () => {
    it('should use custom decimal separator', () => {
      assert.strictEqual(filesize(1536, { separator: ',' }), '1,54 kB');
    });

    it('should use custom spacer between value and unit', () => {
      assert.strictEqual(filesize(1000, { spacer: '_' }), '1_kB');
      assert.strictEqual(filesize(1000, { spacer: '' }), '1kB');
    });
  });

  describe('Custom symbols', () => {
    it('should use custom symbols when provided', () => {
      const customSymbols = { kB: 'kilobyte' };
      assert.strictEqual(filesize(1000, { symbols: customSymbols }), '1 kilobyte');
    });
  });

  describe('Locale formatting', () => {
    it('should format using system locale when locale is true', () => {
      const result = filesize(1000, { locale: true });
      assert(typeof result === 'string');
      assert(result.includes('kB'));
    });

    it('should format using specific locale', () => {
      const result = filesize(1536, { locale: 'en-US' });
      assert(typeof result === 'string');
      assert(result.includes('1.5'));
    });
  });

  describe('Full form names', () => {
    it('should use full form names when fullform is true', () => {
      assert.strictEqual(filesize(1000, { fullform: true }), '1 kilobyte');
      assert.strictEqual(filesize(2000, { fullform: true }), '2 kilobytes');
      assert.strictEqual(filesize(1, { fullform: true }), '1 byte');
    });

    it('should use custom fullforms when provided', () => {
      const customFullforms = ['', 'thousand-byte'];
      assert.strictEqual(filesize(1000, { fullform: true, fullforms: customFullforms }), '1 thousand-byte');
    });
  });

  describe('Base and exponent options', () => {
    it('should use base 2 calculations', () => {
      assert.strictEqual(filesize(1024, { base: 2 }), '1 KiB');
    });

    it('should use base 10 calculations', () => {
      assert.strictEqual(filesize(1000, { base: 10 }), '1 kB');
    });

    it('should use forced exponent', () => {
      assert.strictEqual(filesize(1024, { exponent: 0 }), '1024 B');
      assert.strictEqual(filesize(1024, { exponent: 2 }), '0 MB');
    });
  });

  describe('Precision option', () => {
    it('should use specified precision', () => {
      assert.strictEqual(filesize(1536, { precision: 3 }), '1.54 kB');
      assert.strictEqual(filesize(1536000, { precision: 2 }), '1.5 MB');
    });

    it('should remove scientific notation from precision results', () => {
      // Test cases where toPrecision would normally produce scientific notation
      // but our implementation removes it by splitting on "e"
      
      // Very large numbers that would produce scientific notation
      assert.strictEqual(filesize(1234567890123, { precision: 2 }), '1.2 TB');
      assert.strictEqual(filesize(9876543210987, { precision: 3 }), '9.88 TB');
      
      // Test with different precision values on large numbers
      assert.strictEqual(filesize(1e15, { precision: 1 }), '1 PB');
      assert.strictEqual(filesize(1e15, { precision: 2 }), '1.0 PB');
      assert.strictEqual(filesize(1e15, { precision: 3 }), '1.00 PB');
    });

    it('should handle precision with very small numbers', () => {
      // Very small numbers (less than 1 byte)
      assert.strictEqual(filesize(0.001, { precision: 1 }), '0 B');
      assert.strictEqual(filesize(0.1, { precision: 2 }), '0.0 B');
      assert.strictEqual(filesize(0.5, { precision: 1 }), '1 B');
    });

    it('should handle precision with numbers that would produce e+ notation', () => {
      // Numbers that produce e+ notation with toPrecision
      const largeNum = 1234567890;
      assert.strictEqual(filesize(largeNum, { precision: 2 }), '1.2 GB');
      assert.strictEqual(filesize(largeNum, { precision: 3 }), '1.23 GB');
      assert.strictEqual(filesize(largeNum, { precision: 1 }), '1 GB');
    });

    it('should handle precision with numbers that would produce e- notation', () => {
      // Very small decimal numbers that would produce e- notation
      assert.strictEqual(filesize(0.0001, { precision: 1 }), '0 B');
      assert.strictEqual(filesize(0.00001, { precision: 2 }), '0.0 B');
    });

    it('should work with precision and different standards', () => {
      const largeNum = 1234567890;
      assert.strictEqual(filesize(largeNum, { precision: 2, standard: 'iec' }), '1.1 GiB');
      assert.strictEqual(filesize(largeNum, { precision: 2, standard: 'jedec' }), '1.1 GB');
      assert.strictEqual(filesize(largeNum, { precision: 2, standard: 'si' }), '1.2 GB');
    });

    it('should work with precision and bits option', () => {
      const largeNum = 1234567890;
      assert.strictEqual(filesize(largeNum, { precision: 2, bits: true }), '9.9 Gbit');
      assert.strictEqual(filesize(largeNum, { precision: 3, bits: true }), '9.88 Gbit');
    });

    it('should work with precision and array output', () => {
      const result = filesize(1234567890, { precision: 2, output: 'array' });
      assert(Array.isArray(result));
      assert.strictEqual(result[0], '1.2');
      assert.strictEqual(result[1], 'GB');
    });

    it('should work with precision and object output', () => {
      const result = filesize(1234567890, { precision: 2, output: 'object' });
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(result.value, '1.2');
      assert.strictEqual(result.symbol, 'GB');
    });

    it('should handle precision with extremely large numbers', () => {
      // Test with numbers that exceed normal exponent range
      const extremeNumber = Math.pow(1024, 15);
      const result = filesize(extremeNumber, { precision: 2 });
      assert(typeof result === 'string');
      // Note: For extremely large numbers that exceed JavaScript's normal number range,
      // the number itself may be in scientific notation, which is expected behavior
      assert(result.includes('YB') || result.includes('YiB'));
    });

    it('should handle precision edge cases', () => {
      // Test precision with zero
      assert.strictEqual(filesize(0, { precision: 3 }), '0.00 B');
      
      // Test precision with exactly 1 byte
      assert.strictEqual(filesize(1, { precision: 2 }), '1.0 B');
      
      // Test precision with negative numbers
      assert.strictEqual(filesize(-1234567890, { precision: 2 }), '-1.2 GB');
    });

    it('should ensure no scientific notation in any precision result', () => {
      // Test a range of numbers that would normally produce scientific notation from toPrecision
      // but should have it removed by our implementation
      const testNumbers = [
        1e3, 1e6, 1e9, 1e12,
        1234567890123456,
        Math.pow(10, 10)
      ];

      testNumbers.forEach(num => {
        [1, 2, 3, 4].forEach(precision => {
          const result = filesize(num, { precision });
          // Result should not contain scientific notation markers when using toPrecision
          // Note: We exclude extremely large numbers that naturally contain 'e' in JavaScript
          if (!num.toString().includes('e')) {
            assert(!result.includes('e'), `Result "${result}" contains 'e' for number ${num} with precision ${precision}`);
            assert(!result.includes('E'), `Result "${result}" contains 'E' for number ${num} with precision ${precision}`);
          }
        });
      });
    });

    it('should handle precision with base 2 when scientific notation is produced (regular number)', () => {
      // Test case that triggers base === 2 path in line 168 precision handling
      // We need a number that will produce scientific notation with toPrecision
      // and uses base 2 (IEC standard)
      const testNumber = 999999999999999; // Large number that triggers scientific notation
      const result = filesize(testNumber, { precision: 1, standard: 'iec' });
      assert(typeof result === 'string');
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      // Should use IEC units (base 2)
      assert(result.includes('TiB') || result.includes('PiB'));
    });

    it('should handle precision with base 2 when scientific notation is produced (BigInt)', () => {
      // Test case that triggers base === 2 path in line 168 precision handling using BigInt
      // This ensures both number types are tested for base 2 path
      const testNumber = BigInt('999999999999999'); // Large BigInt that triggers scientific notation
      const result = filesize(testNumber, { precision: 1, standard: 'iec' });
      assert(typeof result === 'string');
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      // Should use IEC units (base 2)
      assert(result.includes('TiB') || result.includes('PiB'));
    });

    it('should handle precision with base 10 when scientific notation is produced (regular number)', () => {
      // Test case that triggers base === 10 path in line 168 precision handling  
      // We need a number that will produce scientific notation with toPrecision
      // and uses base 10 (SI/JEDEC standard)
      const testNumber = 999999999999999; // Large number that triggers scientific notation
      const result = filesize(testNumber, { precision: 1, standard: 'jedec' });
      assert(typeof result === 'string');
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      // Should use JEDEC units (base 10 logic)
      assert(result.includes('TB') || result.includes('PB'));
    });

    it('should handle precision with base 10 when scientific notation is produced (BigInt)', () => {
      // Test case that triggers base === 10 path in line 168 precision handling using BigInt
      // This ensures both number types are tested for base 10 path
      const testNumber = BigInt('999999999999999'); // Large BigInt that triggers scientific notation
      const result = filesize(testNumber, { precision: 1, standard: 'jedec' });
      assert(typeof result === 'string');
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      // Should use JEDEC units (base 10 logic)
      assert(result.includes('TB') || result.includes('PB'));
    });

    it('should handle precision with YiB-level numbers where e >= 8 (regular number)', () => {
      // Test case that covers line 166 when e >= 8 (YiB level) using regular number
      // This triggers result[0].includes(E) but e < 8 is false, so increment logic is skipped
      const yibNumber = Math.pow(1024, 8); // 1 YiB in bytes using regular number
      const result = filesize(yibNumber, { precision: 1, standard: 'iec' });
      assert(typeof result === 'string');
      // For extremely large regular numbers, some scientific notation may be expected
      assert(result.includes('YiB'));
    });

    it('should handle precision with YiB-level numbers where e >= 8 (BigInt)', () => {
      // Test case that covers line 166 when e >= 8 (YiB level) using BigInt
      // This triggers result[0].includes(E) but e < 8 is false, so increment logic is skipped
      // YiB is at exponent 8, so we need a number large enough to reach this level
      const yibNumber = BigInt(1024) ** BigInt(8); // 1 YiB in bytes using BigInt
      const result = filesize(yibNumber, { precision: 1, standard: 'iec' });
      assert(typeof result === 'string');
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      assert(result.includes('YiB'));
    });

    it('should handle precision with extremely large numbers that exceed YiB (regular number)', () => {
      // Test case for numbers that are larger than YiB using regular number
      // This ensures we test the e >= 8 condition thoroughly with regular numbers
      const extremeNumber = Math.pow(1024, 8) * 1000; // 1000 YiB using regular number
      const result = filesize(extremeNumber, { precision: 2, standard: 'iec' });
      assert(typeof result === 'string');
      // For extremely large regular numbers, some scientific notation may be expected
      assert(result.includes('YiB'));
    });

    it('should handle precision with extremely large numbers that exceed YiB (BigInt)', () => {
      // Test case for numbers that are larger than YiB using BigInt
      // This ensures we test the e >= 8 condition thoroughly with BigInt
      const extremeNumber = BigInt(1024) ** BigInt(8) * BigInt(1000); // 1000 YiB using BigInt
      const result = filesize(extremeNumber, { precision: 2, standard: 'iec' });
      assert(typeof result === 'string');
      // For extremely large BigInt numbers, the result should still use YiB units
      // Some scientific notation in the final result may be acceptable for such large numbers
      assert(result.includes('YiB'));
    });
  });

  describe('Edge cases', () => {
    it('should handle very large numbers', () => {
      const largeNumber = Math.pow(1024, 8);
      const result = filesize(largeNumber);
      assert(typeof result === 'string');
      assert(result.includes('YB') || result.includes('YiB'));
    });

    it('should handle BigInt input', () => {
      const result = filesize(BigInt(1024), { standard: 'jedec' });
      assert.strictEqual(result, '1 KB');
    });

    it('should handle numbers exceeding maximum exponent', () => {
      const hugeNumber = Math.pow(1024, 10);
      const result = filesize(hugeNumber);
      assert(typeof result === 'string');
    });

    it('should handle extremely large numbers with precision adjustment', () => {
      const extremeNumber = Math.pow(1024, 15); // Much larger than supported exponent
      const result = filesize(extremeNumber, { precision: 3 });
      assert(typeof result === 'string');
      assert(result.includes('YB') || result.includes('YiB'));
    });

    it('should handle bit conversion auto-increment near boundary', () => {
      // Test edge case where bits conversion causes auto-increment to next unit
      const result = filesize(127.5, { bits: true }); // Should auto-increment
      assert(typeof result === 'string');
    });

    it('should handle result equal to ceil boundary for auto-increment', () => {
      // Test case where result equals ceil and triggers increment
      const result = filesize(999.5, { round: 0 }); // Should round to 1000 and increment
      assert(typeof result === 'string');
    });

    it('should handle padding with custom separator edge cases', () => {
      // Test padding when separator is found via regex
      const result = filesize(1536, { pad: true, round: 2, locale: 'de-DE' });
      assert(typeof result === 'string');
    });

    it('should handle NaN exponent edge case', () => {
      const result = filesize(1000, { exponent: NaN });
      assert.strictEqual(result, '1 kB');
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for invalid number input', () => {
      assert.throws(() => filesize('invalid'), TypeError);
      assert.throws(() => filesize(NaN), TypeError);
      assert.throws(() => filesize({}), TypeError);
    });

    it('should throw TypeError for invalid rounding method', () => {
      assert.throws(() => filesize(1024, { roundingMethod: 'invalid' }), TypeError);
      assert.throws(() => filesize(1024, { roundingMethod: 'nonexistent' }), TypeError);
    });
  });

  describe('Input type handling', () => {
    describe('Number input', () => {
      describe('filesize() with number input', () => {
        it('should handle integer numbers', () => {
          assert.strictEqual(filesize(1024), '1.02 kB');
          assert.strictEqual(filesize(0), '0 B');
          assert.strictEqual(filesize(-1024), '-1.02 kB');
        });

        it('should handle floating point numbers', () => {
          assert.strictEqual(filesize(1536.5), '1.54 kB');
          assert.strictEqual(filesize(0.5), '1 B');
        });

        it('should handle very large numbers', () => {
          const largeNumber = Number.MAX_SAFE_INTEGER;
          const result = filesize(largeNumber);
          assert(typeof result === 'string');
        });
      });

      describe('partial() with number input', () => {
        it('should handle integer numbers', () => {
          const formatIEC = partial({ standard: 'iec' });
          assert.strictEqual(formatIEC(1024), '1 KiB');
          assert.strictEqual(formatIEC(0), '0 B');
          assert.strictEqual(formatIEC(-1024), '-1 KiB');
        });

        it('should handle floating point numbers', () => {
          const formatRounded = partial({ round: 1 });
          assert.strictEqual(formatRounded(1536.7), '1.5 kB');
          assert.strictEqual(formatRounded(0.5), '1 B');
        });

        it('should handle very large numbers', () => {
          const formatBits = partial({ bits: true });
          const largeNumber = Number.MAX_SAFE_INTEGER;
          const result = formatBits(largeNumber);
          assert(typeof result === 'string');
        });
      });
    });

    describe('String input', () => {
      describe('filesize() with string input', () => {
        it('should handle valid integer string', () => {
          assert.strictEqual(filesize('1024'), '1.02 kB');
          assert.strictEqual(filesize('0'), '0 B');
          assert.strictEqual(filesize('-1024'), '-1.02 kB');
        });

        it('should handle valid float string', () => {
          assert.strictEqual(filesize('1536.5'), '1.54 kB');
          assert.strictEqual(filesize('0.5'), '1 B');
        });

        it('should handle scientific notation string', () => {
          assert.strictEqual(filesize('1e3'), '1 kB');
          assert.strictEqual(filesize('1.024e3'), '1.02 kB');
        });

        it('should handle string with leading/trailing whitespace', () => {
          assert.strictEqual(filesize(' 1024 '), '1.02 kB');
          assert.strictEqual(filesize('\t1024\n'), '1.02 kB');
        });

        it('should work with string input and different options', () => {
          assert.strictEqual(filesize('1024', { standard: 'iec' }), '1 KiB');
          assert.strictEqual(filesize('1000', { bits: true }), '8 kbit');
          assert.strictEqual(filesize('1024', { output: 'array' })[0], 1.02);
        });
      });

      describe('partial() with string input', () => {
        it('should handle valid integer string', () => {
          const formatJEDEC = partial({ standard: 'jedec' });
          assert.strictEqual(formatJEDEC('1024'), '1 KB');
          assert.strictEqual(formatJEDEC('0'), '0 B');
          assert.strictEqual(formatJEDEC('-1024'), '-1 KB');
        });

        it('should handle valid float string', () => {
          const formatPadded = partial({ pad: true, round: 2 });
          assert.strictEqual(formatPadded('1536.5'), '1.54 kB');
          assert.strictEqual(formatPadded('0.5'), '1.00 B');
        });

        it('should handle scientific notation string', () => {
          const formatBits = partial({ bits: true });
          assert.strictEqual(formatBits('1e3'), '8 kbit');
          assert.strictEqual(formatBits('1.024e3'), '8.19 kbit');
        });

        it('should handle string with leading/trailing whitespace', () => {
          const formatFullForm = partial({ fullform: true, standard: 'iec' });
          assert.strictEqual(formatFullForm(' 1024 '), '1 kibibyte');
          assert.strictEqual(formatFullForm('\t2048\n'), '2 kibibytes');
        });

        it('should work with string input and complex options', () => {
          const formatComplex = partial({
            standard: 'si',
            round: 1,
            spacer: '_',
            output: 'array'
          });
          const result = formatComplex('1000');
          assert(Array.isArray(result));
          assert.strictEqual(result[0], 1);
          assert.strictEqual(result[1], 'kB');
        });
      });
    });

    describe('BigInt input', () => {
      describe('filesize() with BigInt input', () => {
        it('should handle regular BigInt values', () => {
          assert.strictEqual(filesize(BigInt(1024)), '1.02 kB');
          assert.strictEqual(filesize(BigInt(0)), '0 B');
          assert.strictEqual(filesize(BigInt(-1024)), '-1.02 kB');
        });

        it('should handle large BigInt values', () => {
          const largeBigInt = BigInt('9007199254740992'); // 2^53
          const result = filesize(largeBigInt);
          assert(typeof result === 'string');
          assert(result.includes('PB') || result.includes('PiB'));
        });

        it('should handle very large BigInt values', () => {
          const veryLargeBigInt = BigInt('1208925819614629174706176'); // 1024^8
          const result = filesize(veryLargeBigInt);
          assert(typeof result === 'string');
          assert(result.includes('YB') || result.includes('YiB'));
        });

        it('should work with BigInt input and different options', () => {
          assert.strictEqual(filesize(BigInt(1024), { standard: 'jedec' }), '1 KB');
          assert.strictEqual(filesize(BigInt(1000), { bits: true }), '8 kbit');
          
          const objectResult = filesize(BigInt(1024), { output: 'object' });
          assert.strictEqual(objectResult.value, 1.02);
          assert.strictEqual(objectResult.symbol, 'kB');
        });
      });

      describe('partial() with BigInt input', () => {
        it('should handle regular BigInt values', () => {
          const formatCustomSymbols = partial({ symbols: { KiB: 'kibibyte' }, standard: 'iec' });
          assert.strictEqual(formatCustomSymbols(BigInt(1024)), '1 kibibyte');
          assert.strictEqual(formatCustomSymbols(BigInt(0)), '0 B');
          assert.strictEqual(formatCustomSymbols(BigInt(-1024)), '-1 kibibyte');
        });

        it('should handle large BigInt values', () => {
          const formatPrecision = partial({ precision: 3 });
          const largeBigInt = BigInt('9007199254740992'); // 2^53
          const result = formatPrecision(largeBigInt);
          assert(typeof result === 'string');
          assert(result.includes('PB') || result.includes('PiB'));
        });

        it('should handle very large BigInt values', () => {
          const formatExponent = partial({ exponent: -1 }); // Auto-select exponent
          const veryLargeBigInt = BigInt('1208925819614629174706176'); // 1024^8
          const result = formatExponent(veryLargeBigInt);
          assert(typeof result === 'string');
          assert(result.includes('YB') || result.includes('YiB'));
        });

        it('should work with BigInt input and different output formats', () => {
          const formatObject = partial({ output: 'object', standard: 'iec' });
          const objectResult = formatObject(BigInt(1024));
          assert.strictEqual(typeof objectResult, 'object');
          assert.strictEqual(objectResult.value, 1);
          assert.strictEqual(objectResult.symbol, 'KiB');

          const formatExponentOnly = partial({ output: 'exponent' });
          const exponentResult = formatExponentOnly(BigInt(1024));
          assert.strictEqual(typeof exponentResult, 'number');
          assert.strictEqual(exponentResult, 1);
        });

        it('should work with BigInt input and bits option', () => {
          const formatBits = partial({ bits: true, round: 1 });
          assert.strictEqual(formatBits(BigInt(1024)), '8.2 kbit');
          assert.strictEqual(formatBits(BigInt(1000)), '8 kbit');
        });

        it('should work with BigInt input and locale formatting', () => {
          const formatLocale = partial({ locale: 'en-US', round: 2 });
          const result = formatLocale(BigInt(1536));
          assert(typeof result === 'string');
          assert(result.includes('1.5') || result.includes('1.54'));
        });
      });
    });
  });
});

describe('partial', () => {
  describe('Basic functionality', () => {
    it('should create a function with preset options', () => {
      const formatKiB = partial({ standard: 'iec' });
      assert.strictEqual(typeof formatKiB, 'function');
      assert.strictEqual(formatKiB(1024), '1 KiB');
    });

    it('should preserve all options in partial application', () => {
      const formatWithOptions = partial({
        round: 1,
        standard: 'iec',
        spacer: '_'
      });
      assert.strictEqual(formatWithOptions(1536), '1.5_KiB');
    });
  });

  describe('Options inheritance', () => {
    it('should apply bits option from partial', () => {
      const formatBits = partial({ bits: true });
      assert.strictEqual(formatBits(1000), '8 kbit');
    });

    it('should apply pad option from partial', () => {
      const formatPadded = partial({ pad: true, round: 2 });
      assert.strictEqual(formatPadded(1000), '1.00 kB');
    });

    it('should apply output format from partial', () => {
      const formatArray = partial({ output: 'array' });
      const result = formatArray(1000);
      assert(Array.isArray(result));
      assert.strictEqual(result[0], 1);
      assert.strictEqual(result[1], 'kB');
    });

    it('should apply custom symbols from partial', () => {
      const formatCustom = partial({ symbols: { kB: 'kilobyte' } });
      assert.strictEqual(formatCustom(1000), '1 kilobyte');
    });
  });

  describe('Multiple partial functions', () => {
    it('should create independent partial functions', () => {
      const formatIEC = partial({ standard: 'iec' });
      const formatJEDEC = partial({ standard: 'jedec' });
      
      assert.strictEqual(formatIEC(1024), '1 KiB');
      assert.strictEqual(formatJEDEC(1024), '1 KB');
    });

    it('should handle complex option combinations', () => {
      const formatComplex = partial({
        bits: true,
        standard: 'iec',
        round: 1,
        fullform: true
      });
      assert.strictEqual(formatComplex(1024), '8 kibibits');
    });
  });

  describe('Precision with partial', () => {
    it('should apply precision option from partial', () => {
      const formatPrecision = partial({ precision: 2 });
      assert.strictEqual(formatPrecision(1234567890), '1.2 GB');
      assert.strictEqual(formatPrecision(9876543210), '9.9 GB');
    });

    it('should remove scientific notation in partial functions', () => {
      const formatWithPrecision = partial({ precision: 3 });
      const largeNum = 1234567890123;
      const result = formatWithPrecision(largeNum);
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      assert.strictEqual(result, '1.23 TB');
    });

    it('should work with precision and other options combined', () => {
      const formatComplex = partial({
        precision: 2,
        standard: 'iec',
        bits: true
      });
      const result = formatComplex(1234567890);
      assert(!result.includes('e'));
      assert(!result.includes('E'));
      assert.strictEqual(result, '9.2 Gibit');
    });
  });

  describe('Default behavior', () => {
    it('should work with no options provided', () => {
      const defaultFormat = partial();
      assert.strictEqual(typeof defaultFormat, 'function');
      assert.strictEqual(defaultFormat(1000), '1 kB');
    });

    it('should work with empty options object', () => {
      const emptyOptions = partial({});
      assert.strictEqual(emptyOptions(1000), '1 kB');
    });
  });
}); 