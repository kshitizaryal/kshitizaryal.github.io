/*!
 * Kshitiz Aryal Gulpfile (https://kshitizaryal.github.io)
 * Copyright 2016 Milan Aryal https://milanaryal.com)
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
 //   $ gulp test-scss
 //
 // - Only distribute CSS
 //    $ gulp dist-css

(function (r) {
  'use strict';

  var gulp         = r('gulp'),
      autoprefixer = r('gulp-autoprefixer'),
      clean        = r('gulp-dest-clean'),
      minifycss    = r('gulp-minify-css'),
      rename       = r('gulp-rename'),
      sass         = r('gulp-sass'),
      scsslint     = r('gulp-scss-lint');


  gulp.task('clean', function () {
    return gulp.src('./src/scss/styles.scss', { read: false })
      .pipe(clean('./assets/css'));
  });

  gulp.task('test-scss', function () {
    return gulp.src('./src/scss/**/*.scss')
      .pipe(scsslint({ bundleExec: false, config: './src/scss/.scss-lint.yml', reporterOutput: null }));
  });

  gulp.task('dist-css', function () {
    return gulp.src('./src/scss/styles.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3']	}))
      .pipe(gulp.dest('./assets/css'))
      .pipe(minifycss({ compatibility: 'ie9', keepSpecialComments: false, advanced: false }))
      .pipe(rename('styles.min.css'))
      .pipe(gulp.dest('./assets/css'));
  });

  gulp.task('default', ['clean', 'dist-css']);

})(require);
