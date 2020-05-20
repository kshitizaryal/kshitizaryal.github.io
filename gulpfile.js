/*!
 * Kshitiz Aryal Gulpfile (https://kshitizaryal.com.np)
 * Copyright 2020 Milan Aryal (https://milanaryal.com.np)
 * Licensed under MIT (https://github.com/KshitizAryal/kshitizaryal.github.io/blob/master/LICENSE)
 */

'use strict';

// Load plugin(s)
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
const browserSync = require("browser-sync").create();

/**
 * Configuration(s)
 */

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-shell-commands.md
const cp = require('child_process');

// Load package.json for banner
const pkg = require('./package.json');

// Banner template for files header
const banner = ['/*!',
  ' * <%= pkg.title %> (<%= pkg.url %>)',
  ' * Copyright ' + new Date().getFullYear() + ' <%= pkg.author %> (<%= pkg.author_url %>)',
  ' * Licensed under <%= pkg.license %> (<%= pkg.license_url %>)',
  ' */',
  ''].join('\n');

/**
 * Setup task(s)
 */

// Clean paths
function clean () {
  return del([ 'assets/css/', '_includes/css/', '_site/' ]);
}

// Dist CSS
function css () {
  return src('src/scss/main.scss')
    .pipe(sass.sync({ precision: 6, outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ cascade: false }) ]))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(dest('assets/css/'))
    .pipe(rename('main.min.css'))
    .pipe(postcss([ cssnano(), discardComments({ removeAll: true }) ]))
    .pipe(dest('_includes/css/'))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(dest('assets/css/'));
}

/**
 * Gulp Watch
 * Jekyll & BrowserSync
 */

function site (done) {
  browserSync.notify('Compiling Jekyll, please wait!');
  return cp.spawn('npm', [ 'run', 'jekyll-build' ], { stdio: 'inherit' })
    .on('close', done);
}

// BrowserSync
function server (done) {
  browserSync.init({
    server: {
      baseDir: '_site'
    },
    port: 4000,
    open: false
  }, done);
}

// BrowserSync reload
function serverReload (done) {
  browserSync.reload();
  done();
}

// Watch changes
 function watchFiles () {

  var serve = series(css, site);

  var copyCSS = function (done) {
    browserSync.notify('Compiling CSS, please wait!');
    return cp.spawn('npm', [ 'run', 'copy-css' ], { stdio: 'inherit' })
      .on('close', done);
  };

  // Watch Styles
  watch('src/scss/**', series(css, copyCSS, serverReload));

  // Watch files
  watch([
    '_includes/**/*.html', '!_includes/css/**',
    '_layouts/**/*.html',
    '_pages/**/*.html', '_pages/**/*.md',
    '!node_modules',
    '!_site'
  ], series(serve, serverReload));

}

/**
 * Export task(s)
 */

var build = series(clean, css);
var serve = series(build, site);

// Default task
exports.default = build;

// Watching task
exports.watch = series(serve, parallel(server, watchFiles));
