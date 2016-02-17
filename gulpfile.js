(function () {

  var gulp = require('gulp');
  var del = require('del');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var gulpFilter = require('gulp-filter');

  var conf = {
    src: 'src',
    dist: 'dist'
  };

  var files = {
    src: [
      conf.src + '/core/base.js',
      conf.src + '/core/event.js',
      conf.src + '/core/oop-base.js',
      conf.src + '/core/oop.js'
    ],dist: 'next-js-core.js',
    mini: 'next-js-core.min.js'
  };

  var filesV2={
    src: [
      conf.src + '/core2/base.js',
      conf.src + '/core2/event.js',
      conf.src + '/core2/oop-base.js',
      conf.src + '/core2/oop-define-meta.js',
      conf.src + '/core2/oop.js'
    ],
    dist: 'next-js-core.js',
    mini: 'next-js-core.min.js'
  };

  var filter = gulpFilter(['*'], {restore: true});

  gulp.task('clean', function () {
    del(conf.dist);
  });

  gulp.task('uglify-v1', function () {
    return gulp.src(files.src)
      .pipe(concat(files.dist))
      .pipe(filter)
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('uglify-v2', ['clean'],function () {
    return gulp.src(filesV2.src)
      .pipe(concat(filesV2.dist))
      .pipe(filter)
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['uglify-v1']);
  gulp.task('default-v2', ['uglify-v2']);

}());
