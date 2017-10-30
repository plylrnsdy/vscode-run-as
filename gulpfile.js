const
    os = require('os'),
    { name, version } = require('./package.json'),
    gulp = require('gulp'),
    del = require('del'),
    copyTo = require('gulp-copy')

const
    author = 'plylrnsdy',
    extRoot = `${os.homedir()}\\.vscode\\extensions`,
    oldExt = `/${author}.${name}-*/{.*,*.*,!(node_modules)/**}`,
    newExt = `${extRoot}/${author}.${name}-${version}`


gulp.task('uninstall', require('./.gulp/ext-uninstall')(oldExt, extRoot))

gulp.task('install', ['uninstall'], require('./.gulp/ext-install')(newExt))

gulp.task('install:watch', ['uninstall'], require('./.gulp/watcher')({ globs: 'out/**/*' }, ['install']))