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
    .pipe(concat('index.js'))
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

gulp.task('default',['build', 'test']);
