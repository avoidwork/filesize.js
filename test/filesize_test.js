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
		test.expect(39);
		test.equal(filesize(this.kilobit, {base: 2}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1, bits: true}), "3.9 Kbit", "Should be '3.9 Kbit'");
		test.equal(filesize(this.kilobit, {base: 2, bits: true}), "3.91 Kbit", "Should be '3.91 Kbit'");
		test.equal(filesize(this.kilobit, {base: 2, bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		test.equal(filesize(this.kilobit, {base: 2, bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		test.equal(filesize(this.edgecase, {base: 2}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.edgecase, {base: 2, round: 1}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.kibibyte, {base: 2}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kibibyte, {base: 2, standard: "jedec"}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kibibyte, {base: 2, round: 1}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kibibyte, {base: 2, round: 1, spacer: ""}), "1KB", "Should be '1KB'");
		test.equal(filesize(this.kibibyte, {base: 2, bits: true}), "8 Kbit", "Should be '8 Kbit'");
		test.equal(filesize(this.kibibyte, {base: 2, round: 1, bits: true}), "8 Kbit", "Should be '8 Kbit'");
		test.equal(filesize(this.kibibyte, {base: 2, exponent: 0}), "1024 B", "Should be '1024 B'");
		test.equal(filesize(this.kibibyte, {base: 2, exponent: 0, output: "object"}).unit, "B", "Should be 'B'");
		test.equal(filesize(this.kibibyte, {base: 2, output: "exponent"}), 1, "Should be '1'");
		test.equal(filesize(this.kibibyte, {base: 2, output: "object"}).unit, "KB", "Should be 'KB'");
		test.equal(filesize(this.neg, {base: 2}), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {base: 2, round: 1}), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {base: 2, round: 1, spacer: ""}), "-1KB", "Should be '-1KB'");
		test.equal(filesize(this.neg, {base: 2, bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		test.equal(filesize(this.neg, {base: 2, round: 1, bits: true}), "-8 Kbit", "Should be '-8 Kbit'");
		test.equal(filesize(this.byte, {base: 2}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 2, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {base: 2, round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero, {base: 2}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 2, bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {base: 2, round: 1, bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.huge, {base: 2}), "82718061255302770 YB", "Should be '82718061255302770 YB'");
		test.equal(filesize(this.huge, {base: 2, bits: true}), "661744490042422100 Ybit", "Should be '661744490042422100 Ybit'");
		test.equal(filesize(this.small, {base: 2}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.small, {base: 2, bits: true}), "1 bit", "Should be '1 bit'");
		test.equal(filesize(this.petabyte, {base: 2}), "1 PB", "Should be '1 PB'");
		test.done();
	},
	base10: function (test) {
		test.expect(25);

		test.equal(filesize(this.kilobit), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {bits: true}), "4 Kibit", "Should be '4 Kibit'");
		test.equal(filesize(this.kilobit, {round: 1, bits: true}), "4 Kibit", "Should be '4 Kibit'");
		test.equal(filesize(this.kibibyte), "1.02 KiB", "Should be '1.02 KiB'");
		test.equal(filesize(this.kibibyte, {round: 1}), "1 KiB", "Should be '1 KiB'");
		test.equal(filesize(this.kibibyte, {round: 1, spacer: ""}), "1KiB", "Should be '1KiB'");
		test.equal(filesize(this.kibibyte, {bits: true}), "8.19 Kibit", "Should be '8.19 Kibit'");
		test.equal(filesize(this.kibibyte, {round: 1, bits: true}), "8.2 Kibit", "Should be '8.2 Kibit'");
		test.equal(filesize(this.neg), "-1.02 KiB", "Should be '-1.02 KiB'");
		test.equal(filesize(this.neg, {round: 1}), "-1 KiB", "Should be '-1 KiB'");
		test.equal(filesize(this.neg, {round: 1, spacer: ""}), "-1KiB", "Should be '-1KiB'");
		test.equal(filesize(this.neg, {bits: true}), "-8.19 Kibit", "Should be '-8.19 Kibit'");
		test.equal(filesize(this.neg, {round: 1, bits: true}), "-8.2 Kibit", "Should be '-8.2 Kibit'");
		test.equal(filesize(this.byte), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.byte, {round: 1, bits: true}), "8 bit", "Should be '8 bit'");
		test.equal(filesize(this.zero), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {bits: true}), "0 bit", "Should be '0 bit'");
		test.equal(filesize(this.zero, {round: 1, bits: true}), "0 bit", "Should be '0 bit'");
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
		test.equal(filesize(this.byte, {symbols: {B: "Б"}}), "1 Б", "Should be '1 Б'");
		test.equal(filesize(this.kibibyte, {symbols: {B: "Б"}}), "1.02 KiB", "Should be '1.02 KiB'");
		test.done();
	},
	partial: function (test) {
		test.expect(1);
		test.size = filesize.partial({exponent: 0});
		test.equal(test.size(this.kibibyte), "1024 B", "Should be '1024 B'");
		test.done();
	},
	bits: function (test) {
		test.expect(3);
		test.equal(filesize(124, {bits: true}), "992 bit", "Should be '992 bit'");
		test.equal(filesize(125, {bits: true}), "1 Kibit", "Should be '1 Kibit'");
		test.equal(filesize(126, {bits: true}), "1.01 Kibit", "Should be '1.01 Kibit'");
		test.done();
	},
	fullform: function (test) {
		test.expect(10);
		test.equal(filesize(0, {fullform: true}), "0 bytes", "Should be '0 bytes'");
		test.equal(filesize(0, {fullform: true, output: "object"}).unit, "B", "Should be 'B'");
		test.equal(filesize(1, {bits: true, fullform: true}), "8 bits", "Should be '8 bits'");
		test.equal(filesize(1, {fullform: true}), "1 byte", "Should be '1 byte'");
		test.equal(filesize(this.kibibyte, {standard: "jedec", fullform: true}), "1 kilobyte", "Should be '1 kilobyte'");
		test.equal(filesize(this.kibibyte, {fullform: true}), "1.02 kibibytes", "Should be '1.02 kibibytes'");
		test.equal(filesize(this.kibibyte, {base: 2, fullform: true }), "1 kilobyte", "Should be '1 kilobyte'");
		test.equal(filesize(this.kibibyte, {base: 2, fullform: true, output: "object"}).unit, "KB", "Should be 'KB'");
		test.equal(filesize(this.kibibyte * 1.3, {
			base: 2,
			standard: "iec",
			fullform: true
		}), "1.3 kilobytes", "Should be '1.3 kilobytes'");
		test.equal(filesize(0, {fullform: true, fullforms: ["байт"]}), "0 байт", "Should be '0 байт'");
		test.done();
	},
	exponent: function (test) {
		test.expect(2);
		test.equal(filesize(0, {exponent: 0}), "0 B", "Should be '0 B'");
		test.equal(filesize(0, {exponent: 2}), "0 MiB", "Should be '0 MiB'");
		test.done();
	},
	separator: function (test) {
		test.expect(3);
		test.equal(filesize(1040, {separator: ""}), "1.04 KiB", "Should be '1.04 KiB'");
		test.equal(filesize(1040, {separator: ","}), "1,04 KiB", "Should be '1,04 KiB'");
		test.equal(filesize(1040, {separator: ",", round: 1, pad: true}), "1,0 KiB", "Should be '1,0 KiB'");
		test.done();
	},
	locale: function (test) {
		test.expect(3);
		test.equal(filesize(1040, {locale: ""}), "1.04 KiB", "Should be '1.04 KiB'");
		test.equal(filesize(1040, {locale: true}), Number(1.04).toLocaleString() + " KiB", "Should be '" + Number(1.04).toLocaleString() + " KiB'");
		test.equal(filesize(1040, {locale: "de"}), Number(1.04).toLocaleString("de") + " KiB", "Should be '" + Number(1.04).toLocaleString("de") + " KiB'");
		test.done();
	},
	localeOptions: function (test) {
		test.expect(4);
		test.equal(filesize(this.kibibyte, {locale: "de"}), Number(1.02).toLocaleString("de") + " KiB", "Should be '" + Number(1.02).toLocaleString("de") + " KiB'");
		test.equal(filesize(this.kibibyte, {localeOptions: {minimumFractionDigits: 1}}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " KiB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " KiB'");
		test.equal(filesize(this.kibibyte, {
			base: 10,
			locale: true,
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " KiB", "Should be '" + Number(1.02).toLocaleString(undefined, {minimumFractionDigits: 1}) + " KiB'");
		test.equal(filesize(this.kibibyte, {
			base: 10,
			locale: "de",
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " KiB", "Should be '" + Number(1.02).toLocaleString("de", {minimumFractionDigits: 1}) + " KiB'");
		test.done();
	},
	roundingMethod: function (test) {
		test.expect(9);
		test.equal(filesize(this.kibibyte, {roundingMethod: "round"}), "1.02 KiB", "Should be '1.02 KiB'");
		test.equal(filesize(this.kibibyte, {roundingMethod: "floor"}), "1.02 KiB", "Should be '1.02 KiB'");
		test.equal(filesize(this.kibibyte, {roundingMethod: "ceil"}), "1.03 KiB", "Should be '1.03 KiB'");
		test.equal(filesize(this.kibibyte * 1.333, {roundingMethod: "round"}), "1.36 KiB", "Should be '1.36 KiB'");
		test.equal(filesize(this.kibibyte * 1.333, {roundingMethod: "floor"}), "1.36 KiB", "Should be '1.36 KiB'");
		test.equal(filesize(this.kibibyte * 1.333, {roundingMethod: "ceil"}), "1.37 KiB", "Should be '1.37 KiB'");
		test.equal(filesize(this.kibibyte * 1.456, {round: 1, roundingMethod: "round"}), "1.5 KiB", "Should be '1.5 KiB'");
		test.equal(filesize(this.kibibyte * 1.456, {round: 1, roundingMethod: "floor"}), "1.4 KiB", "Should be '1.4 KiB'");
		test.equal(filesize(this.kibibyte * 1.456, {round: 1, roundingMethod: "ceil"}), "1.5 KiB", "Should be '1.5 KiB'");
		test.done();
	},
	precision: function (test) {
		test.expect(5);
		test.equal(filesize(this.kibibyte * 1, {precision: 3}), "1.02 KiB", "Should be '1.02 KiB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * 10.25, {precision: 3}), "10.8 MiB", "Should be '10.8 MiB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * 10.25, {precision: "x"}), "10.75 MiB", "Should be '10.75 MiB'");
		test.equal(filesize(this.kibibyte * this.kibibyte * this.kibibyte, {precision: 3}), "1.07 GiB", "Should be '1.07 GiB'");
		test.equal(filesize(Math.pow(this.kibibyte, 10), {precision: 3}), "1e+6 YiB", "Should be '1e+6 YiB'");
		test.done();
	},
	defaults: function (test) {
		test.expect(2);
		test.equal(filesize(this.kibibyte), "1.02 KiB", "Should be '1.02 KiB'");
		test.equal(filesize(this.kibibyte, {base: 2}), "1 KB", "Should be '1 KB'");
		test.done();
	}
};
