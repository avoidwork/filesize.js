"use strict";

var fs = require("fs"),
	path = require("path");

module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat: {
			options : {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
				         " * @license <%= pkg.license %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n"
			},
			dist: {
				src : [
					"<banner>",
					"src/intro.js",
					"src/filesize.js",
					"src/outro.js"
				],
				dest : "lib/filesize.es6.js"
			}
		},
		"babel": {
			options: {
				sourceMap: false,
				presets: ["babel-preset-env"]
			},
			dist: {
				files: {
					"lib/<%= pkg.name %>.js": "lib/<%= pkg.name %>.es6.js"
				}
			}
		},
		eslint: {
			target: ["lib/<%= pkg.name %>.es6.js"]
		},
		nodeunit : {
			all : ["test/*.js"]
		},
		uglify: {
			options: {
				banner: "/*\n <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n @version <%= pkg.version %>\n*/",
				sourceMap: true,
				sourceMapIncludeSources: true
			},
			target: {
				files: {
					"lib/filesize.min.js" : ["lib/filesize.js"]
				}
			}
		},
		watch : {
			js : {
				files : "<%= concat.dist.src %>",
				tasks : "build"
			},
			pkg: {
				files : "package.json",
				tasks : "build"
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.task.registerTask("babili", "Minifies ES2016+ code", function () {
		var data = fs.readFileSync(path.join(__dirname, "lib", "filesize.es6.js"), "utf8"),
			minified = require("babel-core").transform(data, {sourceFileName: "filesize.es6.js", sourceMaps: true, presets: ["minify"]}),
			pkg = require(path.join(__dirname, "package.json")),
			banner = "/*\n " + new Date().getFullYear() + " " + pkg.author + "\n @version " + pkg.version + "\n*/\n\"use strict\";";

		fs.writeFileSync(path.join(__dirname, "lib", "filesize.es6.min.js"), banner + minified.code + "\n//# sourceMappingURL=filesize.es6.min.js.map", "utf8");
		grunt.log.ok("1 file created.");
		fs.writeFileSync(path.join(__dirname, "lib", "filesize.es6.min.js.map"), JSON.stringify(minified.map), "utf8");
		grunt.log.ok("1 sourcemap created.");
	});

	// aliases
	grunt.registerTask("test", ["eslint", "nodeunit"]);
	grunt.registerTask("build", ["concat", "babel"]);
	grunt.registerTask("default", ["build", "test", "babili", "uglify"]);
};
