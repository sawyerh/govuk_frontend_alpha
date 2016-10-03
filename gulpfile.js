'use strict'

const packageJson = require('./package.json')
const version = packageJson.version

const gulp = require('gulp')
const del = require('del')
const rename = require('gulp-rename')
const transpiler = require('./lib/transpilation/transpiler.js')
const mocha = require('gulp-mocha')

// Config for paths
const paths = {
  assets: 'app/assets/',
  assetsScss: 'app/assets/scss/',
  dist: 'dist/',
  templates: 'app/templates/',
  npm: 'node_modules/',
  specs: 'test/specs/',
  prototypeScss: 'node_modules/@gemmaleigh/prototype-scss-refactor/**/*.scss' // This can be removed later
}

// Task for cleaning the distribution
gulp.task('clean', () => {
  return del([paths.dist + '*'])
})

// Task for copying the assets
gulp.task('copy:prototype-scss-refactor', () => {
  gulp.src(paths.prototypeScss)
    .pipe(gulp.dest(paths.assetsScss))
})

// Task for transpiling the templates
let transpileRunner = templateLanguage => {
  return gulp.src(paths.templates + '*.html')
    .pipe(transpiler(templateLanguage, version))
    .pipe(rename({extname: '.html.' + templateLanguage}))
    .pipe(gulp.dest(paths.dist))
}
gulp.task('transpile', ['transpile:nunjucks', 'transpile:erb', 'transpile:handlebars', 'transpile:django'])
gulp.task('transpile:nunjucks', () => {
  return gulp.src(paths.templates + '*.html')
    .pipe(rename({extname: '.html.nunjucks'}))
    .pipe(gulp.dest(paths.dist))
})
gulp.task('transpile:erb', transpileRunner.bind(null, 'erb'))
gulp.task('transpile:handlebars', transpileRunner.bind(null, 'handlebars'))
gulp.task('transpile:django', transpileRunner.bind(null, 'django'))

// Task to run the tests
gulp.task('test', () => gulp.src(paths.specs + '*.js', {read: false})
  .pipe(mocha())
)
