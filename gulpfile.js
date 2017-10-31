const
    os = require('os'),
    { name, version, publisher } = require('./package.json'),
    gulp = require('gulp'),
    shell = require('gulp-shell')

const
    extRoot = `${os.homedir()}\\.vscode\\extensions`,
    oldExt = `/${publisher}.${name}-*`,
    newExt = `${extRoot}\\${publisher}.${name}-${version}`


gulp.task('compile', require('./.gulp/compile-ts')())

gulp.task('compile:watch', ['compile'], require('./.gulp/watcher')({ globs: '{src,test}/**/*.ts', outExtension: '.js' }, ['compile']))

gulp.task('uninstall', require('./.gulp/ext-uninstall')(oldExt, extRoot))

gulp.task('install:copy', ['uninstall'], require('./.gulp/ext-install')(newExt))

gulp.task('install', ['install:copy'], shell.task('npm install --production', { cwd: newExt }))

gulp.task('install:watch', ['uninstall'], require('./.gulp/watcher')({ globs: 'out/src/**/*' }, ['install']))