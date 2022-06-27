const path = require("path"),
	filesize = require(path.join(__dirname, "..", "lib", "filesize.es6.js"));

exports.filesize = {
	setUp: function (done) {
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
		done();
	},
	base2: function (test) {
		test.expect(38);
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec"}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", round: 1, bits: true}), "3.9 Kibit", "Should be '3.9 Kibit'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", bits: true}), "3.91 Kibit", "Should be '3.91 Kibit'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "iec", bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		test.equal(filesize(this.edgecase, {base: 2, standard: "iec"}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.edgecase, {base: 2, standard: "iec", round: 1}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec"}), "1 KiB", "Should be '1 KiB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", round: 1}), "1 KiB", "Should be '1 KiB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", round: 1, spacer: ""}), "1KiB", "Should be '1KiB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", bits: true}), "8 Kibit", "Should be '8 Kibit'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", round: 1, bits: true}), "8 Kibit", "Should be '8 Kibit'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", exponent: 0}), "1024 B", "Should be '1024 B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", output: "exponent"}), 1, "Should be '1'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", output: "object"}).unit, "KiB", "Should be 'KiB'");
		test.equal(filesize(this.neg, {base: 2, standard: "iec"}), "-1 KiB", "Should be '-1 KiB'");
		test.equal(filesize(this.neg, {base: 2, standard: "iec", round: 1}), "-1 KiB", "Should be '-1 KiB'");
		test.equal(filesize(this.neg, {base: 2, standard: "iec", round: 1, spacer: ""}), "-1KiB", "Should be '-1KiB'");
		test.equal(filesize(this.neg, {base: 2, standard: "iec", bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		test.equal(filesize(this.neg, {base: 2, standard: "iec", round: 1, bits: true}), "-8 Kibit", "Should be '-8 Kibit'");
		test.equal(filesize(this.byte, {base: 2, standard: "iec"}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, standard: "iec", round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, standard: "iec", round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 2, standard: "iec", bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {base: 2, standard: "iec", round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero, {base: 2, standard: "iec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, standard: "iec", round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, standard: "iec", round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 2, standard: "iec", bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {base: 2, standard: "iec", round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.huge, {base: 2, standard: "iec"}), "82718061255302770 YiB", "Should be '82718061255302770 YiB'");
		test.equal(filesize(this.huge, {base: 2, standard: "iec", bits: true}), "661744490042422100 Yibit", "Should be '661744490042422100 Yibit'");
		test.equal(filesize(this.small, {base: 2, standard: "iec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.small, {base: 2, standard: "iec", bits: true}), "1 bit", "Should be '1 bit'");
		test.equal(filesize(this.petabyte, {base: 2, standard: "iec"}), "1 PiB", "Should be '1 PiB'");
		test.done();
	},
	base2Jedec: function (test) {
		test.expect(38);
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec"}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", round: 1, bits: true}), "3.9 Kbit", "Should be '3.9 Kbit'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", bits: true}), "3.91 Kbit", "Should be '3.91 Kbit'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		test.equal(filesize(this.kilobit, {base: 2, standard: "jedec", bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		test.equal(filesize(this.edgecase, {base: 2, standard: "jedec"}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.edgecase, {base: 2, standard: "jedec", round: 1}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec"}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", round: 1}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", round: 1, spacer: ""}), "1KB", "Should be '1KB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", bits: true}), "8 Kbit", "Should be '8 Kbit'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", round: 1, bits: true}), "8 Kbit", "Should be '8 Kbit'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", exponent: 0}), "1024 B", "Should be '1024 B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", output: "exponent"}), 1, "Should be '1'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec", output: "object"}).unit, "KB", "Should be 'KB'");
		test.equal(filesize(this.neg, {base: 2, standard: "jedec"}), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {base: 2, standard: "jedec", round: 1}), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {base: 2, standard: "jedec", round: 1, spacer: ""}), "-1KB", "Should be '-1KB'");
		test.equal(filesize(this.neg, {base: 2, standard: "jedec", bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		test.equal(filesize(this.neg, {base: 2, standard: "jedec", round: 1, bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		test.equal(filesize(this.byte, {base: 2, standard: "jedec"}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, standard: "jedec", round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, standard: "jedec", round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 2, standard: "jedec", bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {base: 2, standard: "jedec", round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero, {base: 2, standard: "jedec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, standard: "jedec", round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, standard: "jedec", round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 2, standard: "jedec", bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {base: 2, standard: "jedec", round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.huge, {base: 2, standard: "jedec"}), "82718061255302770 YB", "Should be '82718061255302770 YB'");
		test.equal(filesize(this.huge, {base: 2, standard: "jedec", bits: true}), "661744490042422100 Ybit", "Should be '661744490042422100 Ybit'");
		test.equal(filesize(this.small, {base: 2, standard: "jedec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.small, {base: 2, standard: "jedec", bits: true}), "1 bit", "Should be '1 bit'");
		test.equal(filesize(this.petabyte, {base: 2, standard: "jedec"}), "1 PB", "Should be '1 PB'");
		test.done();
	},
	base10: function (test) {
		test.expect(25);

		test.equal(filesize(this.kilobit, {base: 10}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 10, bits: true}), "4 kbit", "Should be '4 kbit'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, bits: true}), "4 kbit", "Should be '4 kbit'");
		test.equal(filesize(this.kibibyte, {base: 10}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1}), "1 kB", "Should be '1 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1, spacer: ""}), "1kB", "Should be '1kB'");
		test.equal(filesize(this.kibibyte, {base: 10, bits: true}), "8.19 kbit", "Should be '8.19 kbit'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1, bits: true}), "8.2 kbit", "Should be '8.2 kbit'");
		test.equal(filesize(this.neg, {base: 10}), "-1.02 kB", "Should be '-1.02 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1}), "-1 kB", "Should be '-1 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1, spacer: ""}), "-1kB", "Should be '-1kB'");
		test.equal(filesize(this.neg, {base: 10, bits: true}), "-8.19 kbit", "Should be '-8.19 kbit'");
		test.equal(filesize(this.neg, {base: 10, round: 1, bits: true}), "-8.2 kbit", "Should be '-8.2 kbit'");
		test.equal(filesize(this.byte, {base: 10}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 10, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {base: 10, round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero, {base: 10}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 10, bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {base: 10, round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		test.done();
	},
	base10Iec: function (test) {
		test.expect(25);
		test.equal(filesize(this.kilobit, {base: 10, standard: "iec"}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, standard: "iec"}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, spacer: "", standard: "iec"}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 10, bits: true, standard: "iec"}), "4 kbit", "Should be '4 kbit'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, bits: true, standard: "iec"}), "4 kbit", "Should be '4 kbit'");
		test.equal(filesize(this.kibibyte, {base: 10, standard: "iec"}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1, standard: "iec"}), "1 kB", "Should be '1 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1, spacer: "", standard: "iec"}), "1kB", "Should be '1kB'");
		test.equal(filesize(this.kibibyte, {base: 10, bits: true, standard: "iec"}), "8.19 kbit", "Should be '8.19 kbit'");
		test.equal(filesize(this.kibibyte, {base: 10, round: 1, bits: true, standard: "iec"}), "8.2 kbit", "Should be '8.2 kbit'");
		test.equal(filesize(this.neg, {base: 10, standard: "iec"}), "-1.02 kB", "Should be '-1.02 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1, standard: "iec"}), "-1 kB", "Should be '-1 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1, spacer: "", standard: "iec"}), "-1kB", "Should be '-1kB'");
		test.equal(filesize(this.neg, {base: 10, bits: true, standard: "iec"}), "-8.19 kbit", "Should be '-8.19 kbit'");
		test.equal(filesize(this.neg, {base: 10, round: 1, bits: true, standard: "iec"}), "-8.2 kbit", "Should be '-8.2 kbit'");
		test.equal(filesize(this.byte, {base: 10, standard: "iec"}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1, standard: "iec"}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1, spacer: "", standard: "iec"}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 10, bits: true, standard: "iec"}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {base: 10, round: 1, bits: true, standard: "iec"}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero, {base: 10, standard: "iec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1, standard: "iec"}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1, spacer: "", standard: "iec"}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 10, bits: true, standard: "iec"}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {base: 10, round: 1, bits: true, standard: "iec"}), "0 bit", "Should be '0 bit'");
		test.done();
	},
	invalid: function (test) {
		test.expect(1);
		test.throws(function () {
			filesize(this.invld);
		}, Error, "Should match");
		test.done();
	},
	symbols: function (test) {
		test.expect(2);
		test.equal(filesize(this.byte, {base: 10, symbols: {B: "Б"}}), "1 Б", "Should be '1 Б'");
		test.equal(filesize(this.kibibyte, {base: 10, symbols: {B: "Б"}}), "1.02 kB", "Should be '1.02 kB'");
		test.done();
	},
	partial: function (test) {
		test.expect(1);
		test.size = filesize.partial({base: 10, exponent: 0});
		test.equal(test.size(this.kibibyte), "1024 B", "Should be '1024 B'");
		test.done();
	},
	bits: function (test) {
		test.expect(3);
		test.equal(filesize(124, {bits: true, base: 10}), "992 bit", "Should be '992 bit'");
		test.equal(filesize(125, {bits: true, base: 10}), "1 kbit", "Should be '1 kbit'");
		test.equal(filesize(126, {bits: true, base: 10}), "1.01 kbit", "Should be '1.01 kbit'");
		test.done();
	},
	fullform: function (test) {
		test.expect(9);
		test.equal(filesize(0, {base: 10, fullform: true}), "0 bytes", "Should be '0 bytes'");
		test.equal(filesize(0, {base: 10, fullform: true, output: "object"}).unit, "B", "Should be 'B'");
		test.equal(filesize(1, {base: 10, bits: true, fullform: true}), "8 bits", "Should be '8 bits'");
		test.equal(filesize(1, {base: 10, fullform: true}), "1 byte", "Should be '1 byte'");
		test.equal(filesize(this.kibibyte, {base: 10, fullform: true}), "1.02 kilobytes", "Should be '1.02 kilobytes'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", fullform: true }), "1 kibibyte", "Should be '1 kibibyte'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "iec", fullform: true, output: "object"}).unit, "KiB", "Should be 'KiB'");
		test.equal(filesize(this.kibibyte * 1.3, {
			base: 2,
			standard: "iec",
			fullform: true
		}), "1.3 kibibytes", "Should be '1.3 kibibytes'");
		test.equal(filesize(0, {base: 10, fullform: true, fullforms: ["байт"]}), "0 байт", "Should be '0 байт'");
		test.done();
	},
	exponent: function (test) {
		test.expect(2);
		test.equal(filesize(0, {base: 10, exponent: 0}), "0 B", "Should be '0 B'");
		test.equal(filesize(0, {base: 10, exponent: 2}), "0 MB", "Should be '0 MB'");
		test.done();
	},
	separator: function (test) {
		test.expect(3);
		test.equal(filesize(1040, {base: 10, separator: ""}), "1.04 kB", "Should be '1.04 kB'");
		test.equal(filesize(1040, {base: 10, separator: ","}), "1,04 kB", "Should be '1,04 kB'");
		test.equal(filesize(1040, {base: 10, separator: ",", round: 1, pad: true}), "1,0 kB", "Should be '1,0 kB'");
		test.done();
	},
	locale: function (test) {
		test.expect(3);
		test.equal(filesize(1040, {base: 10, locale: ""}), "1.04 kB", "Should be '1.04 kB'");
		test.equal(filesize(1040, {base: 10, locale: true}), Number(1.04).toLocaleString() + " kB", "Should be '" + Number(1.04).toLocaleString() + " kB'");
		test.equal(filesize(1040, {base: 10, locale: "de"}), Number(1.04).toLocaleString("de") + " kB", "Should be '" + Number(1.04).toLocaleString("de") + " kB'");
		test.done();
	},
	localeOptions: function (test) {
		test.expect(4);
		test.equal(filesize(this.kibibyte, {base: 10, locale: "de"}), Number(1.02).toLocaleString("de") + " kB", "Should be '" + Number(1.02).toLocaleString("de") + " kB'");
		test.equal(filesize(this.kibibyte, {base: 10, localeOptions: {minimumFractionDigits: 1}}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB'");
		test.equal(filesize(this.kibibyte, {
			base: 10,
			locale: true,
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " kB'");
		test.equal(filesize(this.kibibyte, {
			base: 10,
			locale: "de",
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " kB", "Should be '" + Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " kB'");
		test.done();
	},
	roundingMethod: function (test) {
		test.expect(9);
		test.equal(filesize(this.kibibyte, {base: 10, roundingMethod: "round"}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, roundingMethod: "floor"}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte, {base: 10, roundingMethod: "ceil"}), "1.03 kB", "Should be '1.03 kB'");
		test.equal(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "round"}), "1.36 kB", "Should be '1.36 kB'");
		test.equal(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "floor"}), "1.36 kB", "Should be '1.36 kB'");
		test.equal(filesize(this.kibibyte * 1.333, {base: 10, roundingMethod: "ceil"}), "1.37 kB", "Should be '1.37 kB'");
		test.equal(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "round"}), "1.5 kB", "Should be '1.5 kB'");
		test.equal(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "floor"}), "1.4 kB", "Should be '1.4 kB'");
		test.equal(filesize(this.kibibyte * 1.456, {base: 10, round: 1, roundingMethod: "ceil"}), "1.5 kB", "Should be '1.5 kB'");
		test.done();
	},
	precision: function (test) {
		test.expect(5);
		test.equal(filesize(this.kibibyte * 1, {base: 10, precision: 3}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * 10.25, {base: 10, precision: 3}), "10.8 MB", "Should be '10.8 MB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * 10.25, {base: 10, precision: "x"}), "10.75 MB", "Should be '10.75 MB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * this.kibibyte, {base: 10, precision: 3}), "1.07 GB", "Should be '1.07 GB'");
		test.equal(filesize(Math.pow(this.kibibyte, 10), {base: 10, precision: 3}), "1e+6 YB", "Should be '1e+6 YB'");
		test.done();
	},
	defaults: function (test) {
		test.expect(2);
		test.equal(filesize(this.kibibyte), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kibibyte, {base: 2}), "1 KiB", "Should be '1 KiB'");
		test.done();
	}
};
