const
    gulp = require('gulp')


gulp.task('default', () => { })

gulp.task('compile', require('./.gulp/compile-ts')())

gulp.task('compile:watch', ['compile'], require('./.gulp/watcher')({ globs: '{src,test}/**/*.ts', outExtension: '.js' }, ['compile']))

gulp.task('test', require('./.gulp/unit-test')())

gulp.task('clean', require('./.gulp/clean')())