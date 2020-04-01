/*!
 * Kshitiz Aryal Gulpfile (https://kshitizaryal.github.io)
 * Copyright 2016 Milan Aryal https://milanaryal.com.np)
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

  // Load plugins
  var del          = r('del'),
      gulp         = r('gulp'),
      autoprefixer = r('gulp-autoprefixer'),
      minifycss    = r('gulp-clean-css'),
      rename       = r('gulp-rename'),
      sass         = r('gulp-sass'),
      scsslint     = r('gulp-scss-lint');

  // Clean
  gulp.task('clean', function() {
    return del(['assets/css']);
  });

  // Test SCSS
  gulp.task('test-scss', function () {
    return gulp.src('src/scss/**/*.scss')
      .pipe(scsslint({ bundleExec: false, config: 'src/scss/.scss-lint.yml', reporterOutput: null }));
  });

  // Dist CSS
  gulp.task('dist-css', function () {
    return gulp.src('src/scss/styles.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3']	}))
      .pipe(gulp.dest('assets/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss({ compatibility: 'ie9', keepSpecialComments: false, advanced: false }))
      .pipe(gulp.dest('assets/css'));
  });

  // Default task
  gulp.task('default', ['clean', 'dist-css']);

})(require);
