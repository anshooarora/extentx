/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to clean out the contents in the .tmp/public of your
 * sails project.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = function(grunt) {

	grunt.config.set('clean', {
		dev: [
			'.tmp/public/js/**',
			'.tmp/public/partials/**',
			'.tmp/public/styles/**',
			'.tmp/public/favicon.ico',
			'.tmp/public/robots.txt'
		],
		build: ['www']
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
};
