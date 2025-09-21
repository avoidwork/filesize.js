/**
 * Unit tests for exported helper functions
 * Tests the individual helper functions for better test coverage
 */

import assert from 'assert';
import { 
	getBaseConfiguration,
	handleZeroValue,
	calculateOptimizedValue,
	applyPrecisionHandling,
	applyNumberFormatting
} from '../../src/filesize.js';

describe('Helper Functions', () => {
	describe('getBaseConfiguration', () => {
		it('should return SI configuration', () => {
			const config = getBaseConfiguration('si', -1);
			assert.deepStrictEqual(config, {
				isDecimal: true,
				ceil: 1000,
				actualStandard: 'jedec'
			});
		});

		it('should return IEC configuration', () => {
			const config = getBaseConfiguration('iec', -1);
			assert.deepStrictEqual(config, {
				isDecimal: false,
				ceil: 1024,
				actualStandard: 'iec'
			});
		});

		it('should return JEDEC configuration', () => {
			const config = getBaseConfiguration('jedec', -1);
			assert.deepStrictEqual(config, {
				isDecimal: false,
				ceil: 1024,
				actualStandard: 'jedec'
			});
		});

		it('should handle base=2 override', () => {
			const config = getBaseConfiguration('', 2);
			assert.deepStrictEqual(config, {
				isDecimal: false,
				ceil: 1024,
				actualStandard: 'iec'
			});
		});

		it('should return default configuration', () => {
			const config = getBaseConfiguration('', -1);
			assert.deepStrictEqual(config, {
				isDecimal: true,
				ceil: 1000,
				actualStandard: 'jedec'
			});
		});
	});

	describe('handleZeroValue', () => {
		it('should handle zero with string output', () => {
			const result = handleZeroValue(0, 'jedec', false, {}, false, [], 'string', ' ');
			assert.strictEqual(result, '0 B');
		});

		it('should handle zero with array output', () => {
			const result = handleZeroValue(0, 'jedec', false, {}, false, [], 'array', ' ');
			assert.deepStrictEqual(result, [0, 'B']);
		});

		it('should handle zero with object output', () => {
			const result = handleZeroValue(0, 'jedec', false, {}, false, [], 'object', ' ');
			assert.deepStrictEqual(result, {
				value: 0,
				symbol: 'B',
				exponent: 0,
				unit: 'B'
			});
		});

		it('should handle zero with exponent output', () => {
			const result = handleZeroValue(0, 'jedec', false, {}, false, [], 'exponent', ' ');
			assert.strictEqual(result, 0);
		});

		it('should handle zero with bits', () => {
			const result = handleZeroValue(0, 'jedec', true, {}, false, [], 'string', ' ');
			assert.strictEqual(result, '0 bit');
		});

		it('should handle zero with custom symbols', () => {
			const result = handleZeroValue(0, 'jedec', false, { 'B': 'Bytes' }, false, [], 'string', ' ');
			assert.strictEqual(result, '0 Bytes');
		});

		it('should handle zero with fullform', () => {
			const result = handleZeroValue(0, 'jedec', false, {}, true, [], 'string', ' ');
			assert.strictEqual(result, '0 byte');
		});

		it('should handle zero with precision', () => {
			const result = handleZeroValue(2, 'jedec', false, {}, false, [], 'string', ' ');
			assert.strictEqual(result, '0.0 B');
		});
	});

	describe('calculateOptimizedValue', () => {
		it('should calculate value without bits', () => {
			const result = calculateOptimizedValue(1024, 1, false, false, 1024);
			assert.deepStrictEqual(result, { val: 1, e: 1 });
		});

		it('should calculate value with bits', () => {
			const result = calculateOptimizedValue(1024, 1, false, true, 1024);
			assert.deepStrictEqual(result, { val: 8, e: 1 });
		});

		it('should handle bits auto-increment', () => {
			const result = calculateOptimizedValue(128, 0, false, true, 1024);
			assert.deepStrictEqual(result, { val: 1, e: 1 });
		});

		it('should use decimal powers', () => {
			const result = calculateOptimizedValue(1000, 1, true, false, 1000);
			assert.deepStrictEqual(result, { val: 1, e: 1 });
		});

		it('should not increment when e >= 8', () => {
			// Use a proper YiB value for exponent 8
			const yibValue = Math.pow(1024, 8); // 1 YiB in bytes
			const result = calculateOptimizedValue(yibValue, 8, false, true, 1024);
			assert.strictEqual(result.e, 8);
			assert(result.val >= 8); // Should be 8 bits (1 byte * 8)
		});
	});

	describe('applyPrecisionHandling', () => {
		it('should apply precision without scientific notation', () => {
			const result = applyPrecisionHandling(1.5, 2, 1, 1024, false, false, 1024, Math.round, 2);
			assert.deepStrictEqual(result, { value: '1.5', e: 1 });
		});

		it('should handle scientific notation with increment', () => {
			// Test with a large number that would produce scientific notation
			const result = applyPrecisionHandling(1000000000000, 1, 3, 1e15, true, false, 1000, Math.round, 2);
			assert(typeof result.value === 'string');
			assert(typeof result.e === 'number');
		});

		it('should not increment when e >= 8', () => {
			const result = applyPrecisionHandling(1.5, 2, 8, 1024, false, false, 1024, Math.round, 2);
			assert.deepStrictEqual(result, { value: '1.5', e: 8 });
		});
	});

	describe('applyNumberFormatting', () => {
		it('should format with system locale', () => {
			const result = applyNumberFormatting(1.5, true, {}, '', false, 2);
			assert(typeof result === 'string');
		});

		it('should format with specific locale', () => {
			const result = applyNumberFormatting(1.5, 'en-US', {}, '', false, 2);
			assert(typeof result === 'string');
		});

		it('should apply custom separator', () => {
			const result = applyNumberFormatting(1.5, '', {}, ',', false, 2);
			assert.strictEqual(result, '1,5');
		});

		it('should apply padding', () => {
			const result = applyNumberFormatting(1, '', {}, '', true, 2);
			assert.strictEqual(result, '1.00');
		});

		it('should apply padding with custom separator', () => {
			const result = applyNumberFormatting(1.5, '', {}, ',', true, 3);
			assert.strictEqual(result, '1,500');
		});

		it('should handle no formatting', () => {
			const result = applyNumberFormatting(1.5, '', {}, '', false, 2);
			assert.strictEqual(result, 1.5);
		});

		it('should handle padding with existing decimals', () => {
			const result = applyNumberFormatting(1.5, '', {}, '', true, 3);
			assert.strictEqual(result, '1.500');
		});

		it('should handle padding with no round', () => {
			const result = applyNumberFormatting(1.5, '', {}, '', true, 0);
			assert.strictEqual(result, 1.5);
		});
	});
});
