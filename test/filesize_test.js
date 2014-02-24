var filesize = require("../lib/filesize.js");

exports["filesize"] = {
	setUp: function (done) {
		this.kilobit  = 500;
		this.kilobyte = 1024;
		this.neg      = -1024;
		this.byte     = 1;
		this.zero     = 0;
		this.invld    = "abc";
		done();
	},
	base2: function (test) {
		test.expect(35);

		test.equal(filesize(this.kilobit, {base: 2}),                           "500 B",    "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1}),                 "500 B",    "Should be '500 B'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1, spacer: ""}),     "500B",     "Should be '500B'");
		test.equal(filesize(this.kilobit, {base: 2, unix: true}),               "500",      "Should be '500'");
		test.equal(filesize(this.kilobit, {base: 2, bits :true}),               "3.91 kb",  "Should be '3.91 kb'");
		test.equal(filesize(this.kilobit, {base: 2, round: 1, bits: true}),     "3.9 kb",   "Should be '3.9 kb'");
		test.equal(filesize(this.kilobit, {base: 2, unix: true, bits: true}),   "3.9k",     "Should be '3.9k'");

		test.equal(filesize(this.kilobyte, {base: 2}),                          "1.00 kB",  "Should be '1.00 kB'");
		test.equal(filesize(this.kilobyte, {base: 2, round: 1}),                "1.0 kB",   "Should be '1.0 kB'");
		test.equal(filesize(this.kilobyte, {base: 2, round: 1, spacer: ""}),    "1.0kB",    "Should be '1.0kB'");
		test.equal(filesize(this.kilobyte, {base: 2, unix: true}),              "1K",       "Should be '1K'");
		test.equal(filesize(this.kilobyte, {base: 2, bits :true}),              "8.00 kb",  "Should be '8.00 kb'");
		test.equal(filesize(this.kilobyte, {base: 2, round: 1, bits: true}),    "8.0 kb",   "Should be '8.0 kb'");
		test.equal(filesize(this.kilobyte, {base: 2, unix: true, bits: true}),  "8k",       "Should be '8k'");

		test.equal(filesize(this.neg, {base: 2}),                               "-1.00 kB", "Should be '-1.00 kB'");
		test.equal(filesize(this.neg, {base: 2, round: 1}),                     "-1.0 kB",  "Should be '-1.0 kB'");
		test.equal(filesize(this.neg, {base: 2, round: 1, spacer: ""}),         "-1.0kB",   "Should be '-1.0kB'");
		test.equal(filesize(this.neg, {base: 2, unix: true}),                   "-1K",      "Should be '-1K'");
		test.equal(filesize(this.neg, {base: 2, bits :true}),                   "-8.00 kb", "Should be '-8.00 kb'");
		test.equal(filesize(this.neg, {base: 2, round: 1, bits: true}),         "-8.0 kb",  "Should be '-8.0 kb'");
		test.equal(filesize(this.neg, {base: 2, unix: true, bits: true}),       "-8k",      "Should be '-8k'");

		test.equal(filesize(this.byte, {base: 2}),                              "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, round: 1}),                    "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, round: 1, spacer: ""}),        "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, {base: 2, unix: true}),                  "1",        "Should be '1'");
		test.equal(filesize(this.byte, {base: 2, bits :true}),                  "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, round: 1, bits: true}),        "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {base: 2, unix: true, bits: true}),      "1",        "Should be '1'");

		test.equal(filesize(this.zero, {base: 2, base: 2}),                     "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, round: 1}),                    "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, round: 1, spacer: ""}),        "0B",       "Should be '0B'");
		test.equal(filesize(this.zero, {base: 2, unix: true}),                  "0",        "Should be '0'");
		test.equal(filesize(this.zero, {base: 2, bits :true}),                  "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, round: 1, bits: true}),        "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {base: 2, unix: true, bits: true}),      "0",        "Should be '0'");

		test.done();
	},
	base10: function (test) {
		test.expect(35);

		test.equal(filesize(this.kilobit),                             "500 B",    "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1}),                 "500 B",    "Should be '500 B'");
		test.equal(filesize(this.kilobit, {round: 1, spacer: ""}),     "500B",     "Should be '500B'");
		test.equal(filesize(this.kilobit, {unix: true}),               "500",      "Should be '500'");
		test.equal(filesize(this.kilobit, {bits :true}),               "4.00 kb",  "Should be '4.00 kb'");
		test.equal(filesize(this.kilobit, {round: 1, bits: true}),     "4.0 kb",   "Should be '4.0 kb'");
		test.equal(filesize(this.kilobit, {unix: true, bits: true}),   "3.9k",     "Should be '3.9k'");

		test.equal(filesize(this.kilobyte),                            "1.02 kB",  "Should be '1.02 kB'");
		test.equal(filesize(this.kilobyte, {round: 1}),                "1.0 kB",   "Should be '1.0 kB'");
		test.equal(filesize(this.kilobyte, {round: 1, spacer: ""}),    "1.0kB",    "Should be '1.0kB'");
		test.equal(filesize(this.kilobyte, {unix: true}),              "1K",       "Should be '1K'");
		test.equal(filesize(this.kilobyte, {bits :true}),              "8.19 kb",  "Should be '8.19 kb'");
		test.equal(filesize(this.kilobyte, {round: 1, bits: true}),    "8.2 kb",   "Should be '8.2 kb'");
		test.equal(filesize(this.kilobyte, {unix: true, bits: true}),  "8k",       "Should be '8k'");

		test.equal(filesize(this.neg),                                 "-1.02 kB", "Should be '-1.02 kB'");
		test.equal(filesize(this.neg, {round: 1}),                     "-1.0 kB",  "Should be '-1.0 kB'");
		test.equal(filesize(this.neg, {round: 1, spacer: ""}),         "-1.0kB",   "Should be '-1.0kB'");
		test.equal(filesize(this.neg, {unix: true}),                   "-1K",      "Should be '-1K'");
		test.equal(filesize(this.neg, {bits :true}),                   "-8.19 kb", "Should be '-8.19 kb'");
		test.equal(filesize(this.neg, {round: 1, bits: true}),         "-8.2 kb",  "Should be '-8.2 kb'");
		test.equal(filesize(this.neg, {unix: true, bits: true}),       "-8k",      "Should be '-8k'");

		test.equal(filesize(this.byte),                                "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1}),                    "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1, spacer: ""}),        "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, {unix: true}),                  "1",        "Should be '1'");
		test.equal(filesize(this.byte, {bits :true}),                  "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {round: 1, bits: true}),        "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, {unix: true, bits: true}),      "1",        "Should be '1'");

		test.equal(filesize(this.zero),                                "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1}),                    "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1, spacer: ""}),        "0B",       "Should be '0B'");
		test.equal(filesize(this.zero, {unix: true}),                  "0",        "Should be '0'");
		test.equal(filesize(this.zero, {bits :true}),                  "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {round: 1, bits: true}),        "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, {unix: true, bits: true}),      "0",        "Should be '0'");

		test.done();
	},
	invalid: function (test) {
		test.expect(1);
		test.throws(function () { filesize(this.invld) }, Error, "Should match");
		test.done();
	},
	suffixes: function (test) {
		test.expect(2);

		test.equal(filesize(this.byte,     {suffixes: {B: "Б"}}), "1 Б",     "Should be '1 Б'");
		test.equal(filesize(this.kilobyte, {suffixes: {B: "Б"}}), "1.02 kB", "Should be '1.02 kB'");

		test.done();
	}
};
