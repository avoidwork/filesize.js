import {
	ARRAY,
	BINARY_POWERS,
	BIT,
	BITS,
	BYTE,
	BYTES,
	DECIMAL_POWERS,
	E,
	EMPTY,
	EXPONENT,
	IEC,
	JEDEC,
	OBJECT,
	PERIOD,
	SI,
	STRINGS,
	ZERO
} from "./constants.js";

// Cached configuration lookup for better performance
const STANDARD_CONFIGS = {
	[SI]: {isDecimal: true, ceil: 1000, actualStandard: JEDEC},
	[IEC]: {isDecimal: false, ceil: 1024, actualStandard: IEC},
	[JEDEC]: {isDecimal: false, ceil: 1024, actualStandard: JEDEC}
};

/**
 * Optimized base configuration lookup
 * @param {string} standard - Standard type
 * @param {number} base - Base number
 * @returns {Object} Configuration object
 */
export function getBaseConfiguration (standard, base) {
	// Use cached lookup table for better performance
	if (STANDARD_CONFIGS[standard]) {
		return STANDARD_CONFIGS[standard];
	}

	// Base override
	if (base === 2) {
		return {isDecimal: false, ceil: 1024, actualStandard: IEC};
	}

	// Default
	return {isDecimal: true, ceil: 1000, actualStandard: JEDEC};
}

/**
 * Optimized zero value handling
 * @param {number} precision - Precision value
 * @param {string} actualStandard - Standard to use
 * @param {boolean} bits - Whether to use bits
 * @param {Object} symbols - Custom symbols
 * @param {boolean} full - Whether to use full form
 * @param {Array} fullforms - Custom full forms
 * @param {string} output - Output format
 * @param {string} spacer - Spacer character
 * @returns {string|Array|Object|number} Formatted result
 */
export function handleZeroValue (precision, actualStandard, bits, symbols, full, fullforms, output, spacer) {
	const result = [];
	result[0] = precision > 0 ? (0).toPrecision(precision) : 0;
	const u = result[1] = STRINGS.symbol[actualStandard][bits ? BITS : BYTES][0];

	if (output === EXPONENT) {
		return 0;
	}

	// Apply symbol customization
	if (symbols[result[1]]) {
		result[1] = symbols[result[1]];
	}

	// Apply full form
	if (full) {
		result[1] = fullforms[0] || STRINGS.fullform[actualStandard][0] + (bits ? BIT : BYTE);
	}

	// Return in requested format
	return output === ARRAY ? result : output === OBJECT ? {
		value: result[0],
		symbol: result[1],
		exponent: 0,
		unit: u
	} : result.join(spacer);
}

/**
 * Optimized value calculation with bits handling
 * @param {number} num - Input number
 * @param {number} e - Exponent
 * @param {boolean} isDecimal - Whether to use decimal powers
 * @param {boolean} bits - Whether to calculate bits
 * @param {number} ceil - Ceiling value for auto-increment
 * @returns {Object} Object with val and e properties
 */
export function calculateOptimizedValue (num, e, isDecimal, bits, ceil) {
	const d = isDecimal ? DECIMAL_POWERS[e] : BINARY_POWERS[e];
	let result = num / d;

	if (bits) {
		result *= 8;
		// Handle auto-increment for bits
		if (result >= ceil && e < 8) {
			result /= ceil;
			e++;
		}
	}

	return {result, e};
}

/**
 * Optimized precision handling with scientific notation correction
 * @param {number} value - Current value
 * @param {number} precision - Precision to apply
 * @param {number} e - Current exponent
 * @param {number} num - Original number
 * @param {boolean} isDecimal - Whether using decimal base
 * @param {boolean} bits - Whether calculating bits
 * @param {number} ceil - Ceiling value
 * @param {Function} roundingFunc - Rounding function
 * @param {number} round - Round value
 * @returns {Object} Object with value and e properties
 */
export function applyPrecisionHandling (value, precision, e, num, isDecimal, bits, ceil, roundingFunc, round) {
	let result = value.toPrecision(precision);

	// Handle scientific notation by recalculating with incremented exponent
	if (result.includes(E) && e < 8) {
		e++;
		const {result: valueResult} = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
		const p = round > 0 ? Math.pow(10, round) : 1;
		result = (p === 1 ? roundingFunc(valueResult) : roundingFunc(valueResult * p) / p).toPrecision(precision);
	}

	return {value: result, e};
}

/**
 * Optimized number formatting with locale, separator, and padding
 * @param {number|string} value - Value to format
 * @param {string|boolean} locale - Locale setting
 * @param {Object} localeOptions - Locale options
 * @param {string} separator - Custom separator
 * @param {boolean} pad - Whether to pad
 * @param {number} round - Round value
 * @returns {string|number} Formatted value
 */
export function applyNumberFormatting (value, locale, localeOptions, separator, pad, round) {
	let result = value;

	// Apply locale formatting
	if (locale === true) {
		result = result.toLocaleString();
	} else if (locale.length > 0) {
		result = result.toLocaleString(locale, localeOptions);
	} else if (separator.length > 0) {
		result = result.toString().replace(PERIOD, separator);
	}

	// Apply padding
	if (pad && round > 0) {
		const resultStr = result.toString();
		const x = separator || ((resultStr.match(/(\D)/g) || []).pop() || PERIOD);
		const tmp = resultStr.split(x);
		const s = tmp[1] || EMPTY;
		const l = s.length;
		const n = round - l;

		result = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

	return result;
}
