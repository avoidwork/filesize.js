// Error Messages
export const INVALID_NUMBER = "Invalid number";
export const INVALID_ROUND = "Invalid rounding method";

// Standard Types
export const IEC = "iec";
export const JEDEC = "jedec";
export const SI = "si";

// Unit Types
export const BIT = "bit";
export const BITS = "bits";
export const BYTE = "byte";
export const BYTES = "bytes";
export const SI_KBIT = "kbit";
export const SI_KBYTE = "kB";

// Output Format Types
export const ARRAY = "array";
export const FUNCTION = "function";
export const OBJECT = "object";
export const STRING = "string";

// Processing Constants
export const EXPONENT = "exponent";
export const ROUND = "round";

// Special Characters and Values
export const EMPTY = "";
export const PERIOD = ".";
export const S = "s";
export const SPACE = " ";
export const ZERO = "0";

// Data Structures
export const STRINGS = {
	symbol: {
		iec: {
			bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	},
	fullform: {
		iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
		jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
	}
};
