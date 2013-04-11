var filesize = require("../lib/filesize.js");

exports["filesize"] = {
	setUp: function (done) {
		this.num   = 1024;
		this.str   = "1024";
		this.invld = "abc";
		this.Kb    = 500;
		this.neg   = -1024;
		this.byte  = 1;
		this.zero  = 0;
		done();
	},
	valid: function (test) {
		test.expect(28);

		test.equal(filesize(this.Kb),                "3.91Kb",   "Should be '3.91Kb'");
		test.equal(filesize(this.Kb, 1),             "3.9Kb",    "Should be '3.9Kb'");
		test.equal(filesize(this.Kb, 1, false),      "500B",     "Should be '500B'");
		test.equal(filesize(this.Kb, true),          "3.9k",     "Should be '3.9k'");
		test.equal(filesize(this.Kb, true, false),   "500B",     "Should be '500B'");

		test.equal(filesize(this.num),               "1.00KB",   "Should be '1.00KB'");
		test.equal(filesize(this.num, 1),            "1.0KB",    "Should be '1.0KB'");
		test.equal(filesize(this.num, 1, false),     "1.0KB",    "Should be '1.0KB'");
		test.equal(filesize(this.num, true),         "1K",       "Should be '1K'");
		test.equal(filesize(this.num, true, false),  "1K",       "Should be '1K'");

		test.equal(filesize(this.str),               "1.00KB",   "Should be '1.00KB'");
		test.equal(filesize(this.str, 1),            "1.0KB",    "Should be '1.0KB'");
		test.equal(filesize(this.str, 1, false),     "1.0KB",    "Should be '1.0KB'");
		test.equal(filesize(this.str, true),         "1K",       "Should be '1K'");
		test.equal(filesize(this.str, true, false),  "1K",       "Should be '1K'");

		test.equal(filesize(this.neg),               "-1.00KB",  "Should be '-1.00KB'");
		test.equal(filesize(this.neg, 1),            "-1.0KB",   "Should be '-1.0KB'");
		test.equal(filesize(this.neg, 1, false),     "-1.0KB",   "Should be '-1.0KB'");
		test.equal(filesize(this.neg, true),         "-1K",      "Should be '-1KB'");
		test.equal(filesize(this.neg, true, false),  "-1K",      "Should be '-1KB'");

		test.equal(filesize(this.byte),              "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, 1),           "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, 1, false),    "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, true),        "1B",       "Should be '1B'");
		test.equal(filesize(this.byte, true, false), "1B",       "Should be '1B'");

		test.equal(filesize(this.zero),              "0B",       "Should be '0B'");
		test.equal(filesize(this.zero, 1),           "0B",       "Should be '0B'");
		test.equal(filesize(this.zero, true),        "0B",       "Should be '0B'");

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
