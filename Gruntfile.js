module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat: {
			options : {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n"
			},
			dist: {
				src : [
					"<banner>",
					"src/intro.js",
					"src/filesize.js",
					"src/options.js",
					"src/outro.js"
				],
				dest : "lib/filesize.js"
			}
		},exec : {
			closure : {
				cmd : "cd lib\nclosure-compiler --js <%= pkg.name %>.js --js_output_file <%= pkg.name %>.min.js --create_source_map ./<%= pkg.name %>.map"
			},
			sourcemap : {
				cmd : "echo //@ sourceMappingURL=<%= pkg.name %>.map >> lib/<%= pkg.name %>.min.js"
			}
		},
		jshint : {
			options : {
				jshintrc : ".jshintrc"
			},
			src : "lib/<%= pkg.name %>.js"
		},
		nodeunit : {
			all : ["test/*.js"]
		},
		sed : {
			"version" : {
				pattern : "{{VERSION}}",
				replacement : "<%= pkg.version %>",
				path : ["<%= concat.dist.dest %>"]
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
	grunt.loadNpmTasks("grunt-sed");
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-contrib-watch');

	// aliases
	grunt.registerTask("lint", ["jshint"]);
	grunt.registerTask("test", ["nodeunit"]);
	grunt.registerTask("build", ["concat", "sed", "exec"]);
	grunt.registerTask("default", ["build", "test", "lint"]);
};