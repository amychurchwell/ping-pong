var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');

//environment variable: indicates which environment is being referenced (dev or production).

var buildProduction = utilities.env.production;
//$ gulp build --production (sets var to true)
//for development build $ gulp build

//Instead of browserifying  ./js/pingpong-interface.js file and ./js/signup-interface.js, browserify the new file and use the path ./tmp/allConcat.js.

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] });
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

// return browserify : which files to browserify, pass key 'entries'
// bundle(), part of browserify process. RESEARCH LATER
// make new app.js file put it into new build folder in new js folder.


// * wildcard symbol (globbing pattern). * all files inside js folder that end in -interface.js
gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

// gulp.src to pull in all files used in browser. Format = array of file names.
// concat() pass name of file to create, allConcat.js
// gulp.dest = where to save new file. tmp (temporary) folder bcuz allConcat.js not used in browser. ...Have to BROWSERIFY it. line6

gulp.task("minifyScripts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app.js")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"));
});

// run $ gulp minifyScripts, and it will run jsBrowserify, which will run concatInterface
// JavaScript build tasks go in the order concatInterface -> jsBrowserify -> minifyScripts.

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

// makes sure we are using up-to-date versions of our files every time we build.
// pass del an array of paths to delete.

gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

//whether we run gulp build or gulp build --production, we will have a fresh folder of the newest files to work with

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//analyzes code and warns about parts that don't follow stylistic conventions, or could cause bugs in the future.
