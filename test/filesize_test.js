var filesize = require("../lib/filesize.js");

exports["filesize"] = {
	setUp: function (done) {
		this.num   = 1024;
		this.str   = "1024";
		this.invld = "abc";
		this.kb    = 500;
		this.neg   = -1024;
		this.byte  = 1;
		this.zero  = 0;
		done();
	},
	valid: function (test) {
		test.expect(28);

		test.equal(filesize(this.kb),                "4.00 kb", "Should be '4.00 kb'");
		test.equal(filesize(this.kb, 1),             "4.0 kb",  "Should be '4.0 kb'");
		test.equal(filesize(this.kb, 1, false),      "500 B",   "Should be '500 B'");
		test.equal(filesize(this.kb, true),          "4K",      "Should be '4K'");
		test.equal(filesize(this.kb, true, false),   "500",     "Should be '500'");

		test.equal(filesize(this.num),               "1.02 kB", "Should be '1.02 kB'");
		test.equal(filesize(this.num, 1),            "1.0 kB",  "Should be '1.0 kB'");
		test.equal(filesize(this.num, 1, false),     "1.0 kB",  "Should be '1.0 kB'");
		test.equal(filesize(this.num, true),         "1K",      "Should be '1K'");
		test.equal(filesize(this.num, true, false),  "1K",      "Should be '1K'");

		test.equal(filesize(this.str),               "1.02 kB",  "Should be '1.02 kB'");
		test.equal(filesize(this.str, 1),            "1.0 kB",   "Should be '1.0 kB'");
		test.equal(filesize(this.str, 1, false),     "1.0 kB",   "Should be '1.0 kB'");
		test.equal(filesize(this.str, true),         "1K",       "Should be '1K'");
		test.equal(filesize(this.str, true, false),  "1K",       "Should be '1K'");

		test.equal(filesize(this.neg),               "-1.02 kB", "Should be '-1.02 kB'");
		test.equal(filesize(this.neg, 1),            "-1.0 kB",  "Should be '-1.0 kB'");
		test.equal(filesize(this.neg, 1, false),     "-1.0 kB",  "Should be '-1.0 kB'");
		test.equal(filesize(this.neg, true),         "-1K",      "Should be '-1K'");
		test.equal(filesize(this.neg, true, false),  "-1K",      "Should be '-1K'");

		test.equal(filesize(this.byte),              "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, 1),           "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, 1, false),    "1 B",      "Should be '1 B'");
		test.equal(filesize(this.byte, true),        "1",        "Should be '1'");
		test.equal(filesize(this.byte, true, false), "1",        "Should be '1'");

		test.equal(filesize(this.zero),              "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, 1),           "0 B",      "Should be '0 B'");
		test.equal(filesize(this.zero, true),        "0",        "Should be '0B'");

		test.done();
	},
	invalid: function (test) {
		test.expect(3);
		test.throws(function () { filesize(this.invld) },       Error, "Should match");
		test.throws(function () { filesize(this.invld, 1) },    Error, "Should match");
		test.throws(function () { filesize(this.invld, true) }, Error, "Should match");
		test.done();
	}
};
