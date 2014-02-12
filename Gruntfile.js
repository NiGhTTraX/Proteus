module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			options: {
				banner: '/* <%= pkg.name %> v<%= pkg.version %>\n' +
								'(c) 2014, Andrei Picus\n' +
								'License: GPL */\n'
			},

			build: {
				src: 'src/**/*.js',
				dest: 'build/<%= pkg.name %>.min.js'
			},
		},

		jshint: {
			src: {
				src: [ "src/**/*.js" ],
				options: {
					jshintrc: "src/.jshintrc"
				}
			},
			grunt: {
				src: [ "Gruntfile.js"],
			},
			tests: {
				src: [ "tests/**/*.js" ],
				options: {
					jshintrc: "tests/.jshintrc"
				}
			}
		},

		csslint: {
			tests: {
				src: [ "tests/**/*.css" ]
			},
			demo: {
				src: [ "demo/**/*.css" ],
				options: {
					csslintrc: "demo/.csslintrc"
				}
			}
		},

		qunit: {
			files: [ "tests/**/*.html" ]
		}

	});

	// Grunt plugins.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	// Tasks.
	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('lint', ['jshint', 'csslint']);
	grunt.registerTask('default', ['lint', 'test', 'uglify']);
};

