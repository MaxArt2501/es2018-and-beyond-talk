const { readFileSync } = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');

const { src, dest } = gulp;
const task = gulp.task.bind(gulp);
const watch = gulp.watch.bind(gulp);

task('slides', () => {
  src('src/presentations/**/*.html')
    .pipe(tap(file => {
      // console.log(file.relative, file.path, file.cwd, file.base, file.history, file.stat)
      const html = file.contents.toString();
      const parsed = html.replace(
        /\bslide:(.+?)\s/g,
        (m, source) => {
          try {
            const slide = readFileSync(`src/slides/${source}.html`, 'utf-8');
            return slide;
          } catch (e) {
            console.error(`Slide not found: ${source}`);
            return m;
          }
        }
      );
      file.contents = Buffer.from(parsed);
    }))
    .pipe(dest('public'));
});

task('css', () => {
  src('src/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('public/css'));
});

task('static', () => {
  src([
    'src/scripts/**/*.js'
  ]).pipe(dest('public/js'));
  src([
    'src/styles/big.css',
    'src/styles/highlight.css'
  ]).pipe(dest('public/css'));
  src([
    'src/fonts/*'
  ]).pipe(dest('public/fonts'));
  src([
    'src/images/**/*'
  ]).pipe(dest('public/img'));
});

task('clean', () => {
  rimraf.sync('public');
});

task('watch:css', () => {
  watch('src/styles/**/*.scss', [ 'css' ]);
});
task('watch:slides', () => {
  watch('src/**/*.html', [ 'slides' ]);
});
task('watch:static', () => {
  watch([ 'src/images/**/*', 'src/styles/*.css', 'src/scripts/**/*.js' ], [ 'static' ]);
});

task('watch', [ 'watch:static', 'watch:css', 'watch:slides' ]);
task('default', [ 'static', 'css', 'slides' ]);
