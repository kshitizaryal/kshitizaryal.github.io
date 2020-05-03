/*!
 * Kshitiz Aryal Gulpfile (https://kshitizaryal.com.np)
 * Copyright 2020 Milan Aryal https://milanaryal.com.np)
 * Licensed under MIT (https://github.com/KshitizAryal/kshitizaryal.github.io/blob/master/LICENSE)
 */

'use strict';

// Load plugins
const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const header = require('gulp-header');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const discardComments = require('postcss-discard-comments');
const browsersync = require("browser-sync").create();

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-shell-commands.md
var cp = require('child_process');

// Load package.json for banner
const pkg = require('./package.json');

// Banner template for files header
var banner = ['/*!',
  ' * <%= pkg.title %> (<%= pkg.url %>)',
  ' * Copyright ' + new Date().getFullYear() + ' <%= pkg.author %> (<%= pkg.author_url %>)',
  ' * Licensed under <%= pkg.license %> (<%= pkg.license_url %>)',
  ' */',
  ''].join('\n');

// Clean dist CSS assets
var clean = function () {
  return del(['assets/css/']);
}

// Dist CSS
var css = function () {
  return src('src/scss/main.scss')
    .pipe(header(banner, { pkg : pkg }))
    .pipe(sass.sync({ precision: 6, outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ cascade: false }) ]))
    .pipe(dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([ cssnano(), discardComments({ removeAll: true }) ]))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(dest('assets/css/'));
}

var build = series(clean, css);

// Default task
exports.default = build;

// Gulp Watch
//
// Jekyll & BrowserSync

function site (done) {
  browsersync.notify('Compiling Jekyll, please wait!');
  return cp.spawn('npm', [ 'run', 'jekyll-build' ], { stdio: 'inherit' })
    .on('close', done);
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './_site'
    },
    port: 3000,
    open: false
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch changes
 function watchFiles () {
  // Watch .scss files
  watch('src/scss/**/*.scss', series(clean, css, site, browserSyncReload));
  // Watch site
  watch([
    '_includes/**',
    '_layouts/**',
    '_pages/**',
    'assets/**',
    '!src',
    '!node_modules'
  ], series(site, browserSyncReload));
}

exports.watch = series(clean, css, site, parallel(browserSync, watchFiles));
