'use strict';
var gulp = require('gulp'),
    jasmine = require('gulp-jasmine'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat');

gulp.task('build', () => {
  return gulp.src('src/**.js')
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
    .pipe(concat('tales.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test', () => {
  return gulp.src('spec/**.js')
    .pipe(jasmine({
      config: {
        "spec_dir": "spec",
        "spec_files": [
          "**/*[sS]pec.js"
        ],
        "helpers": [
          "helpers/**/*.js"
          ],
        "stopSpecOnExpectationFailure": false,
        "random": false
      }
    }));

});

gulp.task('watch', () => {
  gulp.watch('src/*.js', ['build']);
  gulp.watch(['spec/**/*.js', 'spec/*.js', 'spec/**/*.tale', 'tales.js'], ['test']);
});

gulp.task('devel', ['default', 'watch']);
gulp.task('default',['build', 'watch']);
