var gulp = require('gulp');
var path = require('path');
var babel = require('gulp-babel');
var shelljs = require('shelljs');
var cwd = process.cwd();
var through2 = require('through2');
var eslint = require('gulp-eslint');
var replace = require('gulp-replace');
var webpack = require('webpack-stream');
var webpackConifg = require('./webpack.config');
var browserSync = require('browser-sync').create();
const projPkg = require(path.join(cwd, 'package.json'));

const BUILD_PATH = path.join(cwd, 'build');
const ROOT_PATH = path.join(cwd, 'src');
const DEMO_PATH = path.join(cwd, 'demo');

gulp.task('clean', function () {
  shelljs.rm('-rf', BUILD_PATH);
});

gulp.task('less', function () {
  var less = require('gulp-less');
  var autoprefixer = require('autoprefixer');
  return gulp.src(ROOT_PATH + '/**/*.less')
      .pipe(less({ globalVars: { theme: `'${projPkg.theme}'` } }))
      .pipe(through2.obj(function (file, encoding, next) {
        file.contents = new Buffer(autoprefixer.process(file.contents.toString(encoding)).css, encoding);
        this.push(file);
        next();
      }))
      .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('copy', function() {
  return gulp.src([ROOT_PATH + '/**/*.jpg', ROOT_PATH + '/**/*.png', ROOT_PATH + '/**/*.gif', ROOT_PATH + '/**/*.webp', ROOT_PATH + '/**/*.icon'])
      .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('lint', function() {
  return gulp.src(ROOT_PATH + '/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
})

gulp.task('webpack', function() {
  return gulp.src(DEMO_PATH + '/index.js')
      .pipe(webpack(webpackConifg))
      .pipe(gulp.dest(DEMO_PATH + '/static'))
});

gulp.task('clean_static', function() {
  shelljs.rm('-rf', DEMO_PATH + '/static');
})

gulp.task('replace', function() {
  return gulp.src([BUILD_PATH + '/*.js'])
      .pipe(replace('.less', '.css'))
      .pipe(gulp.dest(BUILD_PATH))
});

gulp.task('build', ['lint', 'clean', 'copy', 'less', 'replace'], function () {
  return gulp.src([ROOT_PATH + '/**/' + '*.js', ROOT_PATH + '/**/' + '*.jsx'])
      .pipe(babel(require('./.babelrc')))
      .pipe(replace('.less', '.css'))
      .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('server', ['webpack'], function() {
  browserSync.init({
    server: DEMO_PATH
  })

  gulp.watch(DEMO_PATH + '/*', ['clean', 'webpack', browserSync.reload]);
  gulp.watch(ROOT_PATH + '/**/*', ['clean', 'webpack', browserSync.reload])
})
