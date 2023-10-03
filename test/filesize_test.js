import assert from "node:assert";
import {filesize, partial} from "../dist/filesize.cjs";

describe("Testing functionality", function () {
	beforeEach(function () {
		this.kilobit = 500;
		this.edgecase = 1023;
		this.kibibyte = 1024;
		this.petabyte = 1125899906842620;
		this.neg = -1024;
		this.byte = 1;
		this.zero = 0;
		this.invld = "abc";
		this.huge = 10e40;
		this.small = 1 / 8;
		this.bigint = BigInt(this.kibibyte);
		this.bigintBig = BigInt("123422222222222222222222222222222222222");
	});

	it("It should pass base2 tests", function () {
		assert.strictEqual(filesize(this.kilobit, {base: 2}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, round: 1}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, round: 1, spacer: ""}), "500B", "Should be '500B'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, round: 1, bits: true}), "3.9 Kibit", "Should be '3.9 Kibit'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, bits: true}), "3.91 Kibit", "Should be '3.91 Kibit'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.kilobit, {base: 2, bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.edgecase, {base: 2}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.edgecase, {base: 2, round: 1}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2}), "1 KiB", "Should be '1 KiB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, round: 1}), "1 KiB", "Should be '1 KiB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, round: 1, spacer: ""}), "1KiB", "Should be '1KiB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, bits: true}), "8 Kibit", "Should be '8 Kibit'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, round: 1, bits: true}), "8 Kibit", "Should be '8 Kibit'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, exponent: 0}), "1024 B", "Should be '1024 B'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, output: "exponent"}), 1, "Should be '1'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, output: "object"}).unit, "KiB", "Should be 'KiB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", output: "object"}).unit, "KiB", "Should be 'KiB'");
		assert.strictEqual(filesize(this.neg, {base: 2}), "-1 KiB", "Should be '-1 KiB'");
		assert.strictEqual(filesize(this.neg, {base: 2, round: 1}), "-1 KiB", "Should be '-1 KiB'");
		assert.strictEqual(filesize(this.neg, {base: 2, round: 1, spacer: ""}), "-1KiB", "Should be '-1KiB'");
		assert.strictEqual(filesize(this.neg, {base: 2, bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		assert.strictEqual(filesize(this.neg, {base: 2, round: 1, bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		assert.strictEqual(filesize(this.byte, {base: 2}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {base: 2, round: 1}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {base: 2, round: 1, spacer: ""}), "1B", "Should be '1B'");
		assert.strictEqual(filesize(this.byte, {base: 2, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.byte, {base: 2, round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.zero, {base: 2}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {base: 2, round: 1}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {base: 2, round: 1, spacer: ""}), "0B", "Should be '0B'");
		assert.strictEqual(filesize(this.zero, {base: 2, bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.zero, {base: 2, round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.huge, {base: 2}), "82718061255302770 YiB", "Should be '82718061255302770 YiB'");
		assert.strictEqual(filesize(this.huge, {base: 2, bits: true}), "661744490042422100 Yibit", "Should be '661744490042422100 Yibit'");
		assert.strictEqual(filesize(this.small, {base: 2}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.small, {base: 2, bits: true}), "1 bit", "Should be '1 bit'");
		assert.strictEqual(filesize(this.petabyte, {base: 2}), "1 PiB", "Should be '1 PiB'");
	});

	it("It should pass IEC tests", function () {
		assert.strictEqual(filesize(this.kilobit, {standard: "iec"}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", round: 1}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", round: 1, spacer: ""}), "500B", "Should be '500B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", round: 1, bits: true}), "3.9 Kibit", "Should be '3.9 Kibit'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", bits: true}), "3.91 Kibit", "Should be '3.91 Kibit'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.kilobit, {standard: "iec", bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.edgecase, {standard: "iec"}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.edgecase, {standard: "iec", round: 1}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec"}), "1 KiB", "Should be '1 KiB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", round: 1}), "1 KiB", "Should be '1 KiB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", round: 1, spacer: ""}), "1KiB", "Should be '1KiB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", bits: true}), "8 Kibit", "Should be '8 Kibit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", round: 1, bits: true}), "8 Kibit", "Should be '8 Kibit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", exponent: 0}), "1024 B", "Should be '1024 B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", output: "exponent"}), 1, "Should be '1'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", output: "object"}).unit, "KiB", "Should be 'KiB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "iec", output: "object"}).unit, "KiB", "Should be 'KiB'");
		assert.strictEqual(filesize(this.neg, {standard: "iec"}), "-1 KiB", "Should be '-1 KiB'");
		assert.strictEqual(filesize(this.neg, {standard: "iec", round: 1}), "-1 KiB", "Should be '-1 KiB'");
		assert.strictEqual(filesize(this.neg, {standard: "iec", round: 1, spacer: ""}), "-1KiB", "Should be '-1KiB'");
		assert.strictEqual(filesize(this.neg, {standard: "iec", bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		assert.strictEqual(filesize(this.neg, {standard: "iec", round: 1, bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		assert.strictEqual(filesize(this.byte, {standard: "iec"}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "iec", round: 1}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "iec", round: 1, spacer: ""}), "1B", "Should be '1B'");
		assert.strictEqual(filesize(this.byte, {standard: "iec", bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.byte, {standard: "iec", round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "iec"}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "iec", round: 1}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "iec", round: 1, spacer: ""}), "0B", "Should be '0B'");
		assert.strictEqual(filesize(this.zero, {standard: "iec", bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "iec", round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.huge, {standard: "iec"}), "82718061255302770 YiB", "Should be '82718061255302770 YiB'");
		assert.strictEqual(filesize(this.huge, {standard: "iec", bits: true}), "661744490042422100 Yibit", "Should be '661744490042422100 Yibit'");
		assert.strictEqual(filesize(this.small, {standard: "iec"}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.small, {standard: "iec", bits: true}), "1 bit", "Should be '1 bit'");
		assert.strictEqual(filesize(this.petabyte, {standard: "iec"}), "1 PiB", "Should be '1 PiB'");
	});

	it("It should pass JEDEC tests", function () {
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec"}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", round: 1}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", round: 1, spacer: ""}), "500B", "Should be '500B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", round: 1, bits: true}), "3.9 Kbit", "Should be '3.9 Kbit'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", bits: true}), "3.91 Kbit", "Should be '3.91 Kbit'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.kilobit, {standard: "jedec", bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		assert.strictEqual(filesize(this.edgecase, {standard: "jedec"}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.edgecase, {standard: "jedec", round: 1}), "1023 B", "Should be '1023 B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec"}), "1 KB", "Should be '1 KB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", round: 1}), "1 KB", "Should be '1 KB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", round: 1, spacer: ""}), "1KB", "Should be '1KB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", bits: true}), "8 Kbit", "Should be '8 Kbit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", round: 1, bits: true}), "8 Kbit", "Should be '8 Kbit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", exponent: 0}), "1024 B", "Should be '1024 B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", output: "exponent"}), 1, "Should be '1'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "jedec", output: "object"}).unit, "KB", "Should be 'KB'");
		assert.strictEqual(filesize(this.neg, {standard: "jedec"}), "-1 KB", "Should be '-1 KB'");
		assert.strictEqual(filesize(this.neg, {standard: "jedec", round: 1}), "-1 KB", "Should be '-1 KB'");
		assert.strictEqual(filesize(this.neg, {standard: "jedec", round: 1, spacer: ""}), "-1KB", "Should be '-1KB'");
		assert.strictEqual(filesize(this.neg, {standard: "jedec", bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		assert.strictEqual(filesize(this.neg, {standard: "jedec", round: 1, bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		assert.strictEqual(filesize(this.byte, {standard: "jedec"}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "jedec", round: 1}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "jedec", round: 1, spacer: ""}), "1B", "Should be '1B'");
		assert.strictEqual(filesize(this.byte, {standard: "jedec", bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.byte, {standard: "jedec", round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "jedec"}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "jedec", round: 1}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "jedec", round: 1, spacer: ""}), "0B", "Should be '0B'");
		assert.strictEqual(filesize(this.zero, {standard: "jedec", bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "jedec", round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.huge, {standard: "jedec"}), "82718061255302770 YB", "Should be '82718061255302770 YB'");
		assert.strictEqual(filesize(this.huge, {standard: "jedec", bits: true}), "661744490042422100 Ybit", "Should be '661744490042422100 Ybit'");
		assert.strictEqual(filesize(this.small, {standard: "jedec"}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.small, {standard: "jedec", bits: true}), "1 bit", "Should be '1 bit'");
		assert.strictEqual(filesize(this.petabyte, {standard: "jedec"}), "1 PB", "Should be '1 PB'");
	});

	it("It should pass base10 tests", function () {
		assert.strictEqual(filesize(this.kilobit, {base: 10}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {base: 10, round: 1}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {base: 10, round: 1, spacer: ""}), "500B", "Should be '500B'");
		assert.strictEqual(filesize(this.kilobit, {base: 10, bits: true}), "4 kbit", "Should be '4 kbit'");
		assert.strictEqual(filesize(this.kilobit, {base: 10, round: 1, bits: true}), "4 kbit", "Should be '4 kbit'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10}), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, round: 1}), "1 kB", "Should be '1 kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, round: 1, spacer: ""}), "1kB", "Should be '1kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, bits: true}), "8.19 kbit", "Should be '8.19 kbit'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, round: 1, bits: true}), "8.2 kbit", "Should be '8.2 kbit'");
		assert.strictEqual(filesize(this.neg, {base: 10}), "-1.02 kB", "Should be '-1.02 kB'");
		assert.strictEqual(filesize(this.neg, {base: 10, round: 1}), "-1 kB", "Should be '-1 kB'");
		assert.strictEqual(filesize(this.neg, {base: 10, round: 1, spacer: ""}), "-1kB", "Should be '-1kB'");
		assert.strictEqual(filesize(this.neg, {base: 10, bits: true}), "-8.19 kbit", "Should be '-8.19 kbit'");
		assert.strictEqual(filesize(this.neg, {base: 10, round: 1, bits: true}), "-8.2 kbit", "Should be '-8.2 kbit'");
		assert.strictEqual(filesize(this.byte, {base: 10}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {base: 10, round: 1}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {base: 10, round: 1, spacer: ""}), "1B", "Should be '1B'");
		assert.strictEqual(filesize(this.byte, {base: 10, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.byte, {base: 10, round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.zero, {base: 10}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {base: 10, round: 1}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {base: 10, round: 1, spacer: ""}), "0B", "Should be '0B'");
		assert.strictEqual(filesize(this.zero, {base: 10, bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.zero, {base: 10, round: 1, bits: true}), "0 bit", "Should be '0 bit'");
	});

	it("It should pass SI tests", function () {
		assert.strictEqual(filesize(this.kilobit, {standard: "si"}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "si", round: 1}), "500 B", "Should be '500 B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "si", round: 1, spacer: ""}), "500B", "Should be '500B'");
		assert.strictEqual(filesize(this.kilobit, {standard: "si", bits: true}), "4 kbit", "Should be '4 kbit'");
		assert.strictEqual(filesize(this.kilobit, {standard: "si", round: 1, bits: true}), "4 kbit", "Should be '4 kbit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "si"}), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "si", round: 1}), "1 kB", "Should be '1 kB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "si", round: 1, spacer: ""}), "1kB", "Should be '1kB'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "si", bits: true}), "8.19 kbit", "Should be '8.19 kbit'");
		assert.strictEqual(filesize(this.kibibyte, {standard: "si", round: 1, bits: true}), "8.2 kbit", "Should be '8.2 kbit'");
		assert.strictEqual(filesize(this.neg, {standard: "si"}), "-1.02 kB", "Should be '-1.02 kB'");
		assert.strictEqual(filesize(this.neg, {standard: "si", round: 1}), "-1 kB", "Should be '-1 kB'");
		assert.strictEqual(filesize(this.neg, {standard: "si", round: 1, spacer: ""}), "-1kB", "Should be '-1kB'");
		assert.strictEqual(filesize(this.neg, {standard: "si", bits: true}), "-8.19 kbit", "Should be '-8.19 kbit'");
		assert.strictEqual(filesize(this.neg, {standard: "si", round: 1, bits: true}), "-8.2 kbit", "Should be '-8.2 kbit'");
		assert.strictEqual(filesize(this.byte, {standard: "si"}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "si", round: 1}), "1 B", "Should be '1 B'");
		assert.strictEqual(filesize(this.byte, {standard: "si", round: 1, spacer: ""}), "1B", "Should be '1B'");
		assert.strictEqual(filesize(this.byte, {standard: "si", bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.byte, {standard: "si", round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "si"}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "si", round: 1}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(this.zero, {standard: "si", round: 1, spacer: ""}), "0B", "Should be '0B'");
		assert.strictEqual(filesize(this.zero, {standard: "si", bits: true}), "0 bit", "Should be '0 bit'");
		assert.strictEqual(filesize(this.zero, {standard: "si", round: 1, bits: true}), "0 bit", "Should be '0 bit'");
	});

	it("It should pass invalid input tests", function () {
		const input = this.invld;
		assert.throws(function () {
			filesize(input);
		}, Error, "Should match");
	});

	it("It should pass symbols tests", function () {
		assert.strictEqual(filesize(this.byte, {base: 10, symbols: {B: "Б"}}), "1 Б", "Should be '1 Б'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, symbols: {B: "Б"}}), "1.02 kB", "Should be '1.02 kB'");
	});

	it("It should pass partial() tests", function () {
		const size = partial({base: 10, exponent: 0});

		assert.strictEqual(size(this.kibibyte), "1024 B", "Should be '1024 B'");
	});

	it("It should pass bits tests", function () {
		assert.strictEqual(filesize(124, {bits: true, base: 10}), "992 bit", "Should be '992 bit'");
		assert.strictEqual(filesize(125, {bits: true, base: 10}), "1 kbit", "Should be '1 kbit'");
		assert.strictEqual(filesize(126, {bits: true, base: 10}), "1.01 kbit", "Should be '1.01 kbit'");
	});

	it("It should pass full forms tests", function () {
		assert.strictEqual(filesize(0, {base: 10, fullform: true}), "0 bytes", "Should be '0 bytes'");
		assert.strictEqual(filesize(0, {base: 10, fullform: true, output: "object"}).unit, "B", "Should be 'B'");
		assert.strictEqual(filesize(1, {base: 10, bits: true, fullform: true}), "8 bits", "Should be '8 bits'");
		assert.strictEqual(filesize(1, {base: 10, fullform: true}), "1 byte", "Should be '1 byte'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, fullform: true}), "1.02 kilobytes", "Should be '1.02 kilobytes'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, standard: "iec", fullform: true }), "1 kibibyte", "Should be '1 kibibyte'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2, standard: "iec", fullform: true, output: "object"}).unit, "KiB", "Should be 'KiB'");
		assert.strictEqual(filesize(this.kibibyte * 1.3, {
			base: 2,
			standard: "iec",
			fullform: true
		}), "1.3 kibibytes", "Should be '1.3 kibibytes'");
		assert.strictEqual(filesize(0, {base: 10, fullform: true, fullforms: ["байт"]}), "0 байт", "Should be '0 байт'");
	});

	it("It should pass exponent tests", function () {
		assert.strictEqual(filesize(0, {base: 10, exponent: 0}), "0 B", "Should be '0 B'");
		assert.strictEqual(filesize(0, {base: 10, exponent: 2}), "0 MB", "Should be '0 MB'");
	});

	it("It should pass separator tests", function () {
		assert.strictEqual(filesize(1040, {base: 10, separator: ""}), "1.04 kB", "Should be '1.04 kB'");
		assert.strictEqual(filesize(1040, {base: 10, separator: ","}), "1,04 kB", "Should be '1,04 kB'");
		assert.strictEqual(filesize(1040, {base: 10, separator: ",", round: 1, pad: true}), "1,0 kB", "Should be '1,0 kB'");
	});

	it("It should pass locale tests", function () {
		assert.strictEqual(filesize(1040, {base: 10, locale: ""}), "1.04 kB", "Should be '1.04 kB'");
		assert.strictEqual(filesize(1040, {base: 10, locale: true}), Number(1.04).toLocaleString() + " kB", "Should be '" + Number(1.04).toLocaleString() + " kB'");
		assert.strictEqual(filesize(1040, {base: 10, locale: "de"}), Number(1.04).toLocaleString("de") + " kB", "Should be '" + Number(1.04).toLocaleString("de") + " kB'");
	});

	it("It should pass localeOptions tests", function () {
		assert.strictEqual(filesize(this.kibibyte, {base: 10, locale: "de"}), Number(1.02).toLocaleString("de") + " kB", "Should be '" + Number(1.02).toLocaleString("de") + " kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, localeOptions: {minimumFractionDigits: 1}}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB'");
		assert.strictEqual(filesize(this.kibibyte, {
			base: 10,
			locale: true,
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB'");
		assert.strictEqual(filesize(this.kibibyte, {
			base: 10,
			locale: "de",
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " kB'");
	});

	it("It should pass roundingMethod tests", function () {
		assert.strictEqual(filesize(this.kibibyte, {base: 10, roundingMethod: "round"}), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, roundingMethod: "floor"}), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 10, roundingMethod: "ceil"}), "1.03 kB", "Should be '1.03 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "round"}), "1.36 kB", "Should be '1.36 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "floor"}), "1.36 kB", "Should be '1.36 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "ceil"}), "1.37 kB", "Should be '1.37 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "round"}), "1.5 kB", "Should be '1.5 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "floor"}), "1.4 kB", "Should be '1.4 kB'");
		assert.strictEqual(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "ceil"}), "1.5 kB", "Should be '1.5 kB'");
		const input = this.kibibyte * 1.456;
		assert.throws(function () {
			filesize(filesize(input, {base: 10, round: 1, roundingMethod: "invalid"}));
		}, Error, "Should match");
	});

	it("It should pass precision tests", function () {
		assert.strictEqual(filesize(this.kibibyte * 1, {base: 10, precision: 3}), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte * this.kibibyte * 10.25, {base: 10, precision: 3}), "10.8 MB", "Should be '10.8 MB'");
		assert.strictEqual(filesize(this.kibibyte * this.kibibyte * 10.25, {base: 10, precision: "x"}), "10.75 MB", "Should be '10.75 MB'");
		assert.strictEqual(filesize(this.kibibyte * this.kibibyte * this.kibibyte, {base: 10, precision: 3}), "1.07 GB", "Should be '1.07 GB'");
		assert.strictEqual(filesize(Math.pow(this.kibibyte, 10), {base: 10, precision: 3}), "1e+6 YB", "Should be '1e+6 YB'");
	});

	it("It should pass defaults tests", function () {
		assert.strictEqual(filesize(this.kibibyte), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.kibibyte, {base: 2}), "1 KiB", "Should be '1 KiB'");
	});

	it("It should pass BigInt tests", function () {
		assert.strictEqual(filesize(this.bigint), "1.02 kB", "Should be '1.02 kB'");
		assert.strictEqual(filesize(this.bigint, {base: 2}), "1 KiB", "Should be '1 KiB'");
		assert.strictEqual(filesize(this.bigintBig), "123422222222222.23 YB", "Should be '123422222222222.23 YB'");
		assert.strictEqual(filesize(this.bigintBig, {base: 2}), "102092469380433.69 YiB", "Should be '102092469380433.69 YiB'");
	});
});
