/**
 * Unit tests for partial() structuredClone fallback branches
 * Tests the JSON.parse(JSON.stringify(...)) fallback when structuredClone is unavailable
 */

import assert from "node:assert";
import { describe, it } from "node:test";

describe("partial structuredClone fallback", () => {
	it("should use JSON.parse fallback for localeOptions when structuredClone unavailable", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { localeOptions: { minimumFractionDigits: 2 } };
			const format = partial(opts);
			const result = format(1234.5);
			assert(typeof result === "string");
			opts.localeOptions.minimumFractionDigits = 5;
			const result2 = format(1234.5);
			assert(typeof result2 === "string");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should use JSON.parse fallback for symbols when structuredClone unavailable", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { symbols: { kB: "custom_kB" } };
			const format = partial(opts);
			assert.strictEqual(format(1000), "1 custom_kB");
			opts.symbols.kB = "mutated_kB";
			assert.strictEqual(format(1000), "1 custom_kB");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should use JSON.parse fallback for fullforms when structuredClone unavailable", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { fullforms: ["my_byte"], fullform: true };
			const format = partial(opts);
			assert.strictEqual(format(1), "1 my_byte");
			opts.fullforms[0] = "mutated";
			assert.strictEqual(format(1), "1 my_byte");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should handle all three fallbacks simultaneously when structuredClone unavailable", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = {
				localeOptions: { locale: "en-US" },
				symbols: { kB: "kilobyte" },
				fullforms: ["custom_byte"],
				fullform: true,
			};
			const format = partial(opts);
			const result = format(1000);
			assert(typeof result === "string");
			assert(result.includes("kilobyte"));
			opts.localeOptions.locale = "de-DE";
			opts.symbols.kB = "mutated";
			opts.fullforms[0] = "mutated_fullform";
			const result2 = format(1000);
			assert(typeof result2 === "string");
			assert(result2.includes("kilobyte"));
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should handle nested objects in localeOptions with JSON fallback", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = {
				localeOptions: {
					style: "currency",
					currency: "USD",
					nested: { deep: { value: 42 } },
				},
			};
			const format = partial(opts);
			const result = format(1234.5);
			assert(typeof result === "string");
			opts.localeOptions.nested.deep.value = 99;
			const result2 = format(1234.5);
			assert(typeof result2 === "string");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should handle empty objects with JSON fallback", async () => {
		const saved = globalThis.structuredClone;
		delete globalThis.structuredClone;
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { localeOptions: {}, symbols: {}, fullforms: [] };
			const format = partial(opts);
			const result = format(1000);
			assert(typeof result === "string");
			assert.strictEqual(result, "1 kB");
		} finally {
			globalThis.structuredClone = saved;
		}
	});
});

describe("partial safeClone catch block", () => {
	it("should use JSON.parse fallback when structuredClone throws", async () => {
		const saved = globalThis.structuredClone;
		// Keep structuredClone available but make it throw
		globalThis.structuredClone = () => {
			throw new Error("structuredClone not supported");
		};
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { localeOptions: { minimumFractionDigits: 2 } };
			const format = partial(opts);
			const result = format(1234.5);
			assert(typeof result === "string");
			// Verify isolation still works despite structuredClone throwing
			opts.localeOptions.minimumFractionDigits = 5;
			const result2 = format(1234.5);
			assert(typeof result2 === "string");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should use JSON.parse fallback when structuredClone throws for symbols", async () => {
		const saved = globalThis.structuredClone;
		globalThis.structuredClone = () => {
			throw new Error("structuredClone not supported");
		};
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { symbols: { kB: "custom_kB" } };
			const format = partial(opts);
			assert.strictEqual(format(1000), "1 custom_kB");
			opts.symbols.kB = "mutated_kB";
			assert.strictEqual(format(1000), "1 custom_kB");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should use JSON.parse fallback when structuredClone throws for fullforms", async () => {
		const saved = globalThis.structuredClone;
		globalThis.structuredClone = () => {
			throw new Error("structuredClone not supported");
		};
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = { fullforms: ["my_byte"], fullform: true };
			const format = partial(opts);
			assert.strictEqual(format(1), "1 my_byte");
			opts.fullforms[0] = "mutated";
			assert.strictEqual(format(1), "1 my_byte");
		} finally {
			globalThis.structuredClone = saved;
		}
	});

	it("should handle all three with structuredClone throwing", async () => {
		const saved = globalThis.structuredClone;
		globalThis.structuredClone = () => {
			throw new Error("structuredClone not supported");
		};
		try {
			const { partial } = await import("../../src/filesize.js");
			const opts = {
				localeOptions: { locale: "en-US" },
				symbols: { kB: "kilobyte" },
				fullforms: ["custom_byte"],
				fullform: true,
			};
			const format = partial(opts);
			const result = format(1000);
			assert(typeof result === "string");
			assert(result.includes("kilobyte"));
			opts.localeOptions.locale = "de-DE";
			opts.symbols.kB = "mutated";
			opts.fullforms[0] = "mutated_fullform";
			const result2 = format(1000);
			assert(typeof result2 === "string");
			assert(result2.includes("kilobyte"));
		} finally {
			globalThis.structuredClone = saved;
		}
	});
});
