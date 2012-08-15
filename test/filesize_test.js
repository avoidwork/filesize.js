var filesize = require("../dist/filesize.js");

exports["filesize"] = {
	setUp: function (done) {
		this.num   = 1024;
		this.str   = "1024";
		this.invld = "abc";
		done();
	},
	valid: function (test) {
		test.expect(6);
		test.equal(filesize(this.num),       "1.00KB", "Should match");
		test.equal(filesize(this.str),       "1.00KB", "Should match");
		test.equal(filesize(this.num, 1),    "1.0KB",  "Should match");
		test.equal(filesize(this.str, 1),    "1.0KB",  "Should match");
		test.equal(filesize(this.num, true), "1K",     "Should match");
		test.equal(filesize(this.str, true), "1K",     "Should match");
		test.done();
	},
	invalid: function (test) {
		test.expect(3);
		test.throws(function () { filesize(this.abc) },       Error, "Should match");
		test.throws(function () { filesize(this.abc, 1) },    Error, "Should match");
		test.throws(function () { filesize(this.abc, true) }, Error, "Should match");
		test.done();
	}
};
