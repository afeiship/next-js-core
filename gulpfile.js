(function () {

  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var umd = require('gulp-umd');
  var gulpFilter = require('gulp-filter');

  var conf = {
    src: 'src',
    dist: 'dist'
  };

  var files = {
    src: [
      conf.src + '/base.js',
      conf.src + '/event.js',
      conf.src + '/oop-base.js',
      conf.src + '/oop.js'
    ],
    dist: 'nx.js',
    mini: 'nx.min.js'
  };


  var filter = gulpFilter(['*'], {restore: true});

  gulp.task('clean', function () {
    del(conf.dist);
  });

  gulp.task('uglify', ['clean'], function () {
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

  gulp.task('umd', ['uglify'], function () {
    return gulp.src('dist/*.js')
      .pipe(umd({
        dependencies: function (file) {
          return [];
        },
        exports: function (file) {
          return 'nx';
        },
        namespace: function (file) {
          return 'nx';
        },
        templateName: 'amdNodeWeb'
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['umd']);

}());
