'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var jsdoc = require('gulp-jsdoc');
var mocha = require('gulp-mocha');
var notify = require('gulp-notify');


var paths = {

};

gulp.task('bundle', function() {

    return browserify({
        entries:[ './app.js' ],
        debug: true
    })
    .transform('debowerify')
    .bundle()
    .on('error', function(err) {
        this.end();
        gulp.src('').pipe(notify('✖ Bundle Failed ✖'))
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./'))
    .pipe(notify('√ Bundle Success √'));
});


gulp.task('build', function() {
    return gulp.src([ 'bundle.js', 'app.css' ])
        .pipe(gulp.dest('build/'))
        .pipe(rev())
        .pipe(gulp.dest('build/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/'))
        .pipe(notify('√ Build Success √'));
});


gulp.task('dev', function() {
    // body...
});

gulp.task('deploy', ['bundle'], function() {
  var jsFilter = filter('*.js');
  var cssFilter = filter('*.css');

  var userefAssets = useref.assets();

  return gulp.src('index.html')
    .pipe(userefAssets)      // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(csso())
    .pipe(cssFilter.restore())
    .pipe(rev())                // Rename the concatenated files
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace())         // Substitute in new filenames
    .pipe(gulp.dest('public'))
    .pipe(notify('√ Deploy Success √'));
});

gulp.task('prod', function() {
    // body...
});

gulp.task('test', function() {
    return gulp.src('./test/*.js')
        .pipe(mocha({reporter: 'nyan'}))
        .pipe(notify('√ Test Success √'));
});

gulp.task('doc', function() {
    return gulp.src('./lib/*.js')
        .pipe(jsdoc('./docs'))
        .pipe(notify('√ Doc Success √'));
});
