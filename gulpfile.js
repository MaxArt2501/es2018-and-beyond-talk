const { readFileSync } = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');

const { src, dest } = gulp;
const task = gulp.task.bind(gulp);
const watch = gulp.watch.bind(gulp);

const environments = {
  chrome: 'Chrome',
  firefox: 'Firefox',
  safari: 'Safari',
  edge: 'Edge',
  samsung: 'Samsung Internet',
  node: 'Node.js'
};

task('slides', () => {
  src('src/presentations/**/*.html')
    .pipe(tap(file => {
      const html = file.contents.toString();
      const parsed = html
        .replace(
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
        ).replace(
          /([ \t]*)<script support>\((.*?)\)<\/script>/gs,
          (m, indent, json) => {
            try {
              const data = JSON.parse(json);
              const caption = data.caption
                ? [ `  <caption>${data.caption}</caption>` ]
                : [];
              const headers = [];
              const envs = [];
              for (const [ env, version ] of Object.entries(data.support)) {
                if (!(env in environments)) continue;
                headers.push(`      <th><img src="img/${env}.svg" alt="${environments[env]} logo"></th>`);
                const supClass = version ? ' class="ok"' : (version === false ? ' class="ko"' : '');
                envs.push(`      <td${supClass}>${version || ''}</td>`);
              }
              return [
                '<table class="support">',
                ...caption,
                '  <thead>',
                '    <tr>',
                ...headers,
                '    </tr>',
                '  </thead>',
                '  <tbody>',
                '    <tr>',
                ...envs,
                '    </tr>',
                '  </tbody>',
                '</table>'
              ].map(line => indent + line).join('\n');
            } catch (error) {
              console.error('Cannot build support table', error.message);
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
