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
	LOG_10_1000,
	LOG_2_1024,
	OBJECT,
	PERIOD,
	S,
	SI,
	SI_KBIT,
	SI_KBYTE,
	SPACE,
	STRINGS,
	ZERO,
} from "./constants.js";

// Cached configuration lookup for better performance
const STANDARD_CONFIGS = {
	[SI]: { isDecimal: true, ceil: 1000, actualStandard: JEDEC },
	[IEC]: { isDecimal: false, ceil: 1024, actualStandard: IEC },
	[JEDEC]: { isDecimal: false, ceil: 1024, actualStandard: JEDEC },
};

/**
 * Optimized base configuration lookup
 * @param {string} standard - Standard type
 * @param {number} base - Base number
 * @returns {Object} Configuration object
 */
export function getBaseConfiguration(standard, base) {
	// Use cached lookup table for better performance
	if (STANDARD_CONFIGS[standard]) {
		return STANDARD_CONFIGS[standard];
	}

	// Base override
	if (base === 2) {
		return { isDecimal: false, ceil: 1024, actualStandard: IEC };
	}

	// Default
	return { isDecimal: true, ceil: 1000, actualStandard: JEDEC };
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
 * @param {string} [symbol] - Symbol to use (defaults based on bits/standard)
 * @returns {string|Array|Object|number} Formatted result
 */
export function handleZeroValue(
	precision,
	actualStandard,
	bits,
	symbols,
	full,
	fullforms,
	output,
	spacer,
	symbol,
) {
	const value = precision > 0 ? (0).toPrecision(precision) : 0;

	if (output === EXPONENT) {
		return 0;
	}

	// Set default symbol if not provided
	if (!symbol) {
		symbol = bits
			? STRINGS.symbol[actualStandard].bits[0]
			: STRINGS.symbol[actualStandard].bytes[0];
	}

	// Apply symbol customization
	if (symbols[symbol]) {
		symbol = symbols[symbol];
	}

	// Apply full form
	if (full) {
		symbol = fullforms[0] || STRINGS.fullform[actualStandard][0] + (bits ? BIT : BYTE);
	}

	// Return in requested format
	if (output === ARRAY) {
		return [value, symbol];
	}

	if (output === OBJECT) {
		return { value, symbol, exponent: 0, unit: symbol };
	}

	return value + spacer + symbol;
}

/**
 * Optimized value calculation with bits handling
 * @param {number} num - Input number
 * @param {number} e - Exponent
 * @param {boolean} isDecimal - Whether to use decimal powers
 * @param {boolean} bits - Whether to calculate bits
 * @param {number} ceil - Ceiling value for auto-increment
 * @param {boolean} autoExponent - Whether exponent is auto (-1 or NaN)
 * @returns {Object} Object with result and e properties
 */
export function calculateOptimizedValue(num, e, isDecimal, bits, ceil, autoExponent = true) {
	const d = isDecimal ? DECIMAL_POWERS[e] : BINARY_POWERS[e];
	let result = num / d;

	if (bits) {
		result *= 8;
		// Handle auto-increment for bits (only when exponent is auto)
		if (autoExponent && result >= ceil && e < 8) {
			result /= ceil;
			e++;
		}
	}

	return { result, e };
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
 * @param {number} exponent - Forced exponent (-1 for auto)
 * @returns {Object} Object with value and e properties
 */
export function applyPrecisionHandling(
	value,
	precision,
	e,
	num,
	isDecimal,
	bits,
	ceil,
	roundingFunc,
	round,
	exponent,
) {
	let result = value.toPrecision(precision);

	const autoExponent = exponent === -1 || isNaN(exponent);

	// Handle scientific notation by recalculating with incremented exponent
	if (result.includes(E) && e < 8 && autoExponent) {
		e++;
		const { result: valueResult } = calculateOptimizedValue(num, e, isDecimal, bits, ceil);
		const p = round > 0 ? Math.pow(10, round) : 1;
		result = (p === 1 ? roundingFunc(valueResult) : roundingFunc(valueResult * p) / p).toPrecision(
			precision,
		);
	}

	return { value: result, e };
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
export function applyNumberFormatting(value, locale, localeOptions, separator, pad, round) {
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
		const x = separator || (resultStr.slice(1).match(/[.,]/g) || []).pop() || PERIOD;
		const tmp = resultStr.split(x);
		const s = tmp[1] || EMPTY;

		const l = s.length;
		const n = round - l;

		result = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

	return result;
}

/**
 * Calculates exponent from the input value using pre-computed log values and clamps to supported range
 * Also adjusts precision when exponent exceeds the lookup table bounds
 * @param {number} num - Input file size in bytes
 * @param {number} e - Current exponent value
 * @param {number} exponent - Original user-provided exponent option (-1 for auto)
 * @param {boolean} isDecimal - Whether to use decimal (SI) base
 * @param {number} precision - Current precision value (modified when e > 8)
 * @returns {Object} Object with computed e value and possibly adjusted precision
 */
export function calculateExponent(num, e, exponent, isDecimal, precision) {
	if (e === -1 || isNaN(e)) {
		e = isDecimal
			? Math.floor(Math.log(num) / LOG_10_1000)
			: Math.floor(Math.log(num) / LOG_2_1024);
		if (e < 0) {
			e = 0;
		}
	}

	if (e > 8) {
		if (precision > 0) {
			precision += 8 - e;
		}
		return { e: 8, precision };
	}

	return { e, precision };
}

/**
 * Applies rounding to the raw calculated value and handles auto-increment ceiling
 * @param {number} val - Raw value before rounding
 * @param {number} ceil - Ceiling threshold (1000 for SI, 1024 for IEC)
 * @param {number} e - Current exponent value
 * @param {number} round - Number of decimal places
 * @param {Function} roundingFunc - Rounding method (Math.round, Math.floor, Math.ceil)
 * @param {boolean} autoExponent - Whether exponent is auto-calculated (-1 or NaN)
 * @returns {Object} Object with rounded value and possibly incremented exponent
 */
export function applyRounding(val, ceil, e, round, roundingFunc, autoExponent) {
	const p = e > 0 && round > 0 ? Math.pow(10, round) : 1;
	let r = p === 1 ? roundingFunc(val) : roundingFunc(val * p) / p;

	if (r === ceil && e < 8 && autoExponent) {
		r = 1;
		e++;
	}

	return { value: r, e };
}

/**
 * Resolves the unit symbol for the given standard, bits mode, and exponent
 * Handles SI standard special case where exponent 1 always uses "kB" or "kbit"
 * @param {string} actualStandard - The resolved standard (iec, jedec)
 * @param {boolean} bits - Whether formatting bit values
 * @param {number} e - Current exponent index
 * @param {boolean} isDecimal - Whether using decimal (SI) base
 * @returns {string} The resolved unit symbol string
 */
export function resolveSymbol(actualStandard, bits, e, isDecimal) {
	const symbolTable = STRINGS.symbol[actualStandard][bits ? BITS : BYTES];
	return isDecimal && e === 1 ? (bits ? SI_KBIT : SI_KBYTE) : symbolTable[e];
}

/**
 * Decorates the result: applies negation, custom symbols, number formatting, and full form names
 * Mutates the result array in-place for both value (index 0) and symbol (index 1)
 * @param {Array} result - Result array with numeric value at [0] and string symbol at [1]
 * @param {boolean} neg - Whether the original input was negative
 * @param {Object} symbols - Custom symbol override map
 * @param {string|boolean} locale - Locale string for formatting
 * @param {Object} localeOptions - Additional locale formatting options
 * @param {string} separator - Custom decimal separator
 * @param {boolean} pad - Whether zero-pad decimals
 * @param {number} round - Target decimal count for padding
 * @param {boolean} full - Whether to use full unit names
 * @param {Array} fullforms - Custom full unit name overrides
 * @param {string} actualStandard - Unit standard for full form lookup
 * @param {number} e - Current exponent index
 * @param {boolean} bits - Whether formatting bit values
 * @returns {void} Mutates result array in place
 */
export function decorateResult(
	result,
	neg,
	symbols,
	locale,
	localeOptions,
	separator,
	pad,
	round,
	full,
	fullforms,
	actualStandard,
	e,
	bits,
) {
	if (neg) {
		result[0] = -result[0];
	}

	if (symbols[result[1]]) {
		result[1] = symbols[result[1]];
	}

	result[0] = applyNumberFormatting(result[0], locale, localeOptions, separator, pad, round);

	if (full) {
		result[1] =
			fullforms[e] ||
			STRINGS.fullform[actualStandard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
	}
}

/**
 * Formats the computed result array into the requested output type
 * @param {Array} result - Result array with formatted value at [0] and symbol at [1]
 * @param {number} e - Current exponent
 * @param {string} u - Original resolved symbol (before custom override)
 * @param {string} output - Output type (ARRAY, OBJECT, STRING)
 * @param {string} spacer - String separator between value and unit
 * @returns {string|Array|Object|number} Formatted result in requested type
 */
export function formatOutput(result, e, u, output, spacer) {
	if (output === ARRAY) {
		return result;
	}

	if (output === OBJECT) {
		return {
			value: result[0],
			symbol: result[1],
			exponent: e,
			unit: u,
		};
	}

	return spacer === SPACE ? `${result[0]} ${result[1]}` : result.join(spacer);
}
