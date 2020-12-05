"use strict";

var fs = require("fs"),
	path = require("path");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		eslint: {
			target: [
				"Gruntfile.js",
				"test/*.js",
				"src/*.js"
			]
		},
		nodeunit: {
			all: ["test/*.js"]
		},
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-eslint");

	// aliases
	grunt.registerTask("test", ["eslint", "nodeunit"]);
	grunt.registerTask("default", ["test"]);
};
