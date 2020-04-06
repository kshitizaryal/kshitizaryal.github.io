/*!
 * Kshitiz Aryal Gulpfile (https://kshitizaryal.com.np)
 * Copyright 2020 Milan Aryal https://milanaryal.com.np)
 * Licensed under MIT (https://github.com/KshitizAryal/kshitizaryal.github.io/blob/master/LICENSE)
 */

 // Getting started with Gulp:
 //
 // 1. Install Node.js
 // 2. $ npm install --global gulp-cli
 // 3. $ cd ./kshitizaryal.github.io
 // 4. $ npm install
 // 5. $ gulp
 //
 //
 // Gulp task(s):
 //
 // - Full distribution (Currently clean CSS distribution folder and distribute CSS)
 //   $ gulp
 //
 // - Test SCSS
 //   $ gulp testStyles
 //
 // - Only distribute CSS
 //    $ gulp distStyles

'use strict';

// Load plugins
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const header = require('gulp-header');
const pkg = require('./package.json');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const scsslint = require('gulp-scss-lint');

// Banner template for files header
var banner = ['/*!',
  ' * <%= pkg.title %> (<%= pkg.url %>)',
  ' * Copyright ' + new Date().getFullYear() + ' <%= pkg.author %> (<%= pkg.author_url %>)',
  ' * Licensed under <%= pkg.license %> (<%= pkg.license_url %>)',
  ' */',
  ''].join('\n');

// Test SCSS
exports.testStyles = function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(scsslint({ bundleExec: false, config: '.scss-lint.yml', reporterOutput: null }));
}

// Clean dist CSS assets
var clean = function () {
  return del(['assets/css']);
}

// Dist CSS
var distStyles = function () {
  return gulp.src('src/scss/styles.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({ level: { 1: { specialComments: false } } }))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest('assets/css'));
}

var build = gulp.series(clean, distStyles);

// Default task
exports.default = build;

// Watch changes
exports.watch = function () {
  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', build);
}
