"use strict";

var gulp		= require('gulp'),
    concat		= require('gulp-concat'),
    uglify		= require('gulp-uglify'),
    rename		= require('gulp-rename'),
    sass		= require('gulp-sass'),
    maps		= require('gulp-sourcemaps'),
    minifyCSS		= require('gulp-minify-css'),
    del			= require('del'),
    autoprefixer	= require('gulp-autoprefixer'),
    babel		= require("gulp-babel"),
    minifyCss		= require('gulp-minify-css'),
    browserSync		= require('browser-sync'),
    runSequence		= require('run-sequence');

gulp.task('compileSassBefore', function() {
	return gulp.src("assets/css/scss/before/*.scss")
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: [
				"Android 2.3",
				"Android >= 4",
				"Chrome >= 20",
				"Firefox >= 24",
				"Explorer >= 8",
				"iOS >= 6",
				"Opera >= 12",
				"Safari >= 6"
			]
		}))
		.pipe(maps.write('.'))
		.pipe(rename('style.before.css'))
		.pipe(gulp.dest('assets/css/scss'))
		;
});

gulp.task('compileSassAfter', function() {
	return gulp.src("assets/css/scss/after/*.scss")
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: [
				"Android 2.3",
				"Android >= 4",
				"Chrome >= 20",
				"Firefox >= 24",
				"Explorer >= 8",
				"iOS >= 6",
				"Opera >= 12",
				"Safari >= 6"
			]
		}))
		.pipe(maps.write('.'))
		.pipe(rename('style.after.css'))
		.pipe(gulp.dest('assets/css/scss'))
		;
});

gulp.task('compileSassFix', function() {
	return gulp.src("assets/css/scss/fix/*.scss")
		//.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: [
				"Android 2.3",
				"Android >= 4",
				"Chrome >= 20",
				"Firefox >= 24",
				"Explorer >= 8",
				"iOS >= 6",
				"Opera >= 12",
				"Safari >= 6"
			]
		}))
		//.pipe(maps.write('.'))
		//.pipe(rename('style.after.css'))
		.pipe(gulp.dest('assets/css/fix'))
		;
});

gulp.task("concatScriptsBefore", function() {
    return gulp.src([
            'assets/js/parts/before/**/' + '*.js'
        ])
        .pipe(concat('main.before.js'))
        .pipe(gulp.dest('assets/js/parts'))
});

gulp.task("concatScriptsAfter", function() {
    return gulp.src([
            'assets/js/parts/after/**/' + '*.js'
        ])
        .pipe(concat('main.after.js'))
        .pipe(gulp.dest('assets/js/parts'))
});

gulp.task('minifyCssBefore', function() {
	return gulp.src("assets/css/scss/style.before.css")
		.pipe(minifyCSS())
		.pipe(rename('style.before.min.css'))
		.pipe(gulp.dest('assets/css/'))
		//.pipe(browserSync.stream())
		;
});

gulp.task('minifyCssAfter', function() {
	return gulp.src("assets/css/scss/style.after.css")
		.pipe(minifyCSS())
		.pipe(rename('style.after.min.css'))
		.pipe(gulp.dest('assets/css/'))
		//.pipe(browserSync.stream())
		;
});


gulp.task('minifyJsBefore', function() {
	return gulp.src("assets/js/parts/main.before.js")
		.pipe(uglify())
		.pipe(rename('main.before.min.js'))
		.pipe(gulp.dest('assets/js/'))
		;
});

gulp.task('minifyJsAfter', function() {
	return gulp.src("assets/js/parts/main.after.js")
		.pipe(uglify())
		.pipe(rename('main.after.min.js'))
		.pipe(gulp.dest('assets/js/'))
		;
});


gulp.task("_build_CSS_BEFORE", function(){runSequence('compileSassBefore', 'minifyCssBefore');});
gulp.task("_build_CSS_AFTER", function(){runSequence('compileSassAfter', 'minifyCssAfter');});
gulp.task("_build_CSS_FIX", function(){runSequence('compileSassFix');});
gulp.task("_build_CSS", ['_build_CSS_BEFORE', '_build_CSS_AFTER', '_build_CSS_FIX']);

gulp.task("_build_JS_BEFORE", function(){runSequence('concatScriptsBefore', 'minifyJsBefore');});
gulp.task("_build_JS_AFTER", function(){runSequence('concatScriptsAfter', 'minifyJsAfter');});
gulp.task("_build_JS", ['_build_JS_BEFORE', '_build_JS_AFTER']);

gulp.task("_build_ALL", ['_build_CSS', '_build_JS']);

var config = require('./gulpConfig.json');
gulp.task('_WATCH', function() {
	browserSync.init(config.browserSync);
	
	gulp.watch("assets/css/scss/before/*.scss", function(){runSequence('compileSassBefore', 'minifyCssBefore', browserSync.reload);});
	gulp.watch("assets/css/scss/after/*.scss", function(){runSequence('compileSassAfter', 'minifyCssAfter', browserSync.reload);});
	gulp.watch("assets/css/scss/fix/*.scss", function(){runSequence('compileSassFix', browserSync.reload);});
	
	gulp.watch("assets/js/parts/before/*.js", function(){runSequence('concatScriptsBefore', 'minifyJsBefore', browserSync.reload);});
	gulp.watch("assets/js/parts/after/*.js", function(){runSequence('concatScriptsAfter', 'minifyJsAfter', browserSync.reload);});
	
	/*
	gulp.watch("C:/xampp/htdocs/pavels/cdi/###PATH_TO_FILE###.php").on("change", browserSync.reload);
	*/
});
