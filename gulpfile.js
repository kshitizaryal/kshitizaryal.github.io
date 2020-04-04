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
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const scsslint = require('gulp-scss-lint');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');

// Test SCSS
exports.testStyles = function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(scsslint({ bundleExec: false, config: '.scss-lint.yml', reporterOutput: null }));
}

// Process and minify SVG icons
exports.buildIcons = function () {
  return gulp.src('src/svgs/**/*.svg', { base: 'src/icons' })
    .pipe(svgmin())
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/icons'));
}

// Clean
var clean = function () {
  return del(['assets/css']);
}

// Dist CSS
var distStyles = function () {
  return gulp.src('src/scss/styles.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({ level: { 1: { specialComments: false } } }))
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
