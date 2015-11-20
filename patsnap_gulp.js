/**
 * Created by wx on 11/20/15.
 */
'use strict';

var gulp = require("gulp");
var watch = require('gulp-watch');
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var babelify = require("babelify");




gulp.task('react', function() {
	return browserify({ debug: true })
			.transform(babelify,{presets: ["es2015", "react"]})
			.require('./src/ps_main/index.js', { entry: true })
			.bundle()
			.on("error", function (err) {
				console.error(err.toString());
				this.emit('end');

			})
			.pipe(source('main-bundle.js'))
			.pipe(gulp.dest('./dist/'));

});

gulp.task('watchJs', function() {
	return watch(['./src/ps_main/**/*.{js,es}'], function() {
		gulp.start('react');
	});
});