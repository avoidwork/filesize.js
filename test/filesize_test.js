const path = require("path"),
	{main} = require(path.join(__dirname, "..", "package.json")),
	filesize = require(path.join(__dirname, "..", main));

exports.filesize = {
	setUp: function (done) {
		this.kilobit = 500;
		this.edgecase = 1023;
		this.kilobyte = 1024;
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
		test.expect(46);
		test.equal(filesize(this.kilobit), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {unix: true}), "500", "Should be '500'");
		test.equal(filesize(this.kilobit, {round: 1, bits: true}), "3.9 Kb", "Should be '3.9 Kb'");
		test.equal(filesize(this.kilobit, {bits: true}), "3.91 Kb", "Should be '3.91 Kb'");
		test.equal(filesize(this.kilobit, {unix: true, bits: true}), "3.9K", "Should be '3.9K'");
		test.equal(filesize(this.kilobit, {bits: true, output: "array"})[0], 3.91, "Should be '3.91'");
		test.equal(filesize(this.kilobit, {bits: true, output: "object"}).value, 3.91, "Should be '3.91'");
		test.equal(filesize(this.edgecase), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.edgecase, {round: 1}), "1023 B", "Should be '1023 B'");
		test.equal(filesize(this.kilobyte), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kilobyte, {round: 1}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(this.kilobyte, {round: 1, spacer: ""}), "1KB", "Should be '1KB'");
		test.equal(filesize(this.kilobyte, {unix: true}), "1K", "Should be '1K'");
		test.equal(filesize(this.kilobyte, {bits: true}), "8 Kb", "Should be '8 Kb'");
		test.equal(filesize(this.kilobyte, {round: 1, bits: true}), "8 Kb", "Should be '8 Kb'");
		test.equal(filesize(this.kilobyte, {unix: true, bits: true}), "8K", "Should be '8K'");
		test.equal(filesize(this.kilobyte, {exponent: 0}), "1024 B", "Should be '1024 B'");
		test.equal(filesize(this.kilobyte, {output: "exponent"}), 1, "Should be '1'");
		test.equal(filesize(this.neg), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {round: 1}), "-1 KB", "Should be '-1 KB'");
		test.equal(filesize(this.neg, {round: 1, spacer: ""}), "-1KB", "Should be '-1KB'");
		test.equal(filesize(this.neg, {unix: true}), "-1K", "Should be '-1K'");
		test.equal(filesize(this.neg, {bits: true}), "-8 Kb", "Should be '-8 Kb'");
		test.equal(filesize(this.neg, {round: 1, bits: true}), "-8 Kb", "Should be '-8 Kb'");
		test.equal(filesize(this.neg, {unix: true, bits: true}), "-8K", "Should be '-8K'");
		test.equal(filesize(this.byte), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {unix: true}), "1", "Should be '1'");
		test.equal(filesize(this.byte, {bits: true}), "8 b", "Should be '8 b'");
		test.equal(filesize(this.byte, {round: 1, bits: true}), "8 b", "Should be '8 b'");
		test.equal(filesize(this.byte, {unix: true, bits: true}), "8", "Should be '8'");
		test.equal(filesize(this.zero), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {unix: true}), "0", "Should be '0'");
		test.equal(filesize(this.zero, {bits: true}), "0 b", "Should be '0 b'");
		test.equal(filesize(this.zero, {round: 1, bits: true}), "0 b", "Should be '0 b'");
		test.equal(filesize(this.zero, {unix: true, bits: true}), "0", "Should be '0'");
		test.equal(filesize(this.huge), "82718061255302770 YB", "Should be '82718061255302770 YB'");
		test.equal(filesize(this.huge, {bits: true}), "661744490042422100 Yb", "Should be '661744490042422100 Yb'");
		test.equal(filesize(this.small), "0 B", "Should be '0 B'");
		test.equal(filesize(this.small, {bits: true}), "1 b", "Should be '1 b'");
		test.equal(filesize(this.petabyte), "1 PB", "Should be '1 PB'");
		test.done();
	},
	base10: function (test) {
		test.expect(35);

		test.equal(filesize(this.kilobit, {base: 10}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1}), "500 B", "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, spacer: ""}), "500B", "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 10, unix: true}), "500", "Should be '500'");
		test.equal(filesize(this.kilobit, {base: 10, bits: true}), "4 kb", "Should be '4 kb'");
		test.equal(filesize(this.kilobit, {base: 10, round: 1, bits: true}), "4 kb", "Should be '4 kb'");
		test.equal(filesize(this.kilobit, {base: 10, unix: true, bits: true}), "4k", "Should be '4k'");
		test.equal(filesize(this.kilobyte, {base: 10}), "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.kilobyte, {base: 10, round: 1}), "1 kB", "Should be '1 kB'");
		test.equal(filesize(this.kilobyte, {base: 10, round: 1, spacer: ""}), "1kB", "Should be '1kB'");
		test.equal(filesize(this.kilobyte, {base: 10, unix: true}), "1k", "Should be '1k'");
		test.equal(filesize(this.kilobyte, {base: 10, bits: true}), "8.19 kb", "Should be '8.19 kb'");
		test.equal(filesize(this.kilobyte, {base: 10, round: 1, bits: true}), "8.2 kb", "Should be '8.2 kb'");
		test.equal(filesize(this.kilobyte, {base: 10, unix: true, bits: true}), "8.2k", "Should be '8.2k'");
		test.equal(filesize(this.neg, {base: 10}), "-1.02 kB", "Should be '-1.02 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1}), "-1 kB", "Should be '-1 kB'");
		test.equal(filesize(this.neg, {base: 10, round: 1, spacer: ""}), "-1kB", "Should be '-1kB'");
		test.equal(filesize(this.neg, {base: 10, unix: true}), "-1k", "Should be '-1k'");
		test.equal(filesize(this.neg, {base: 10, bits: true}), "-8.19 kb", "Should be '-8.19 kb'");
		test.equal(filesize(this.neg, {base: 10, round: 1, bits: true}), "-8.2 kb", "Should be '-8.2 kb'");
		test.equal(filesize(this.neg, {base: 10, unix: true, bits: true}), "-8.2k", "Should be '-8.2k'");
		test.equal(filesize(this.byte, {base: 10}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1}), "1 B", "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 10, round: 1, spacer: ""}), "1B", "Should be '1B'");
		test.equal(filesize(this.byte, {base: 10, unix: true}), "1", "Should be '1'");
		test.equal(filesize(this.byte, {base: 10, bits: true}), "8 b", "Should be '8 b'");
		test.equal(filesize(this.byte, {base: 10, round: 1, bits: true}), "8 b", "Should be '8 b'");
		test.equal(filesize(this.byte, {base: 10, unix: true, bits: true}), "8", "Should be '8'");
		test.equal(filesize(this.zero, {base: 10}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1}), "0 B", "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 10, round: 1, spacer: ""}), "0B", "Should be '0B'");
		test.equal(filesize(this.zero, {base: 10, unix: true}), "0", "Should be '0'");
		test.equal(filesize(this.zero, {base: 10, bits: true}), "0 b", "Should be '0 b'");
		test.equal(filesize(this.zero, {base: 10, round: 1, bits: true}), "0 b", "Should be '0 b'");
		test.equal(filesize(this.zero, {base: 10, unix: true, bits: true}), "0", "Should be '0'");
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
		test.equal(filesize(this.kilobyte, {symbols: {B: "Б"}}), "1 KB", "Should be '1 KB'");
		test.done();
	},
	partial: function (test) {
		test.expect(1);
		test.size = filesize.partial({exponent: 0});
		test.equal(test.size(this.kilobyte), "1024 B", "Should be '1024 B'");
		test.done();
	},
	bits: function (test) {
		test.expect(3);
		test.equal(filesize(124, {bits: true, base: 10}), "992 b", "Should be '992 b'");
		test.equal(filesize(125, {bits: true, base: 10}), "1 kb", "Should be '1 kb'");
		test.equal(filesize(126, {bits: true, base: 10}), "1.01 kb", "Should be '1.01 kb'");
		test.done();
	},
	fullform: function (test) {
		test.expect(7);
		test.equal(filesize(0, {fullform: true}), "0 bytes", "Should be '0 bytes'");
		test.equal(filesize(1, {bits: true, base: 10, fullform: true}), "8 bits", "Should be '8 bits'");
		test.equal(filesize(1, {base: 10, fullform: true}), "1 byte", "Should be '1 byte'");
		test.equal(filesize(this.kilobyte, {fullform: true}), "1 kilobyte", "Should be '1 kilobyte'");
		test.equal(filesize(this.kilobyte, {fullform: true, standard: "iec"}), "1 kibibyte", "Should be '1 kibibyte'");
		test.equal(filesize(this.kilobyte * 1.3, {
			fullform: true,
			standard: "iec"
		}), "1.3 kibibytes", "Should be '1.3 kibibytes'");
		test.equal(filesize(0, {fullform: true, fullforms: ["байт"]}), "0 байт", "Should be '0 байт'");
		test.done();
	},
	exponent: function (test) {
		test.expect(2);
		test.equal(filesize(0, {exponent: 0}), "0 B", "Should be '0 B'");
		test.equal(filesize(0, {exponent: 2}), "0 MB", "Should be '0 MB'");
		test.done();
	},
	separator: function (test) {
		test.expect(2);
		test.equal(filesize(1040, {separator: ""}), "1.02 KB", "Should be '1.02 KB'");
		test.equal(filesize(1040, {separator: ","}), "1,02 KB", "Should be '1,02 KB'");
		test.done();
	},
	locale: function (test) {
		test.expect(3);
		test.equal(filesize(1040, {locale: ""}), "1.02 KB", "Should be '1.02 KB'");
		test.equal(filesize(1040, {locale: true}), Number(1.02).toLocaleString() + " KB", "Should be '" + Number(1.02).toLocaleString() + " KB'");
		test.equal(filesize(1040, {locale: "de"}), Number(1.02).toLocaleString("de") + " KB", "Should be '" + Number(1.02).toLocaleString("de") + " KB'");
		test.done();
	},
	localeOptions: function (test) {
		test.expect(4);
		test.equal(filesize(1024, {locale: "de"}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(1024, {localeOptions: {minimumFractionDigits: 1}}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(1024, {
			locale: true,
			localeOptions: {minimumFractionDigits: 1}
		}), "1 KB", "Should be '1 KB'");
		test.equal(filesize(1024, {
			locale: "de",
			localeOptions: {minimumFractionDigits: 1}
		}), Number(1).toLocaleString("de", {minimumFractionDigits: 1}) + " KB", "Should be '" + Number(1).toLocaleString("de", {minimumFractionDigits: 1}) + " KB'");
		test.done();
	}
};
