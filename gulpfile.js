const
    gulp = require('gulp'),
    del = require('del'),
    copyTo = require('gulp-copy'),
    version = require('./package.json').version,
    os = require('os')

const extDir = `${os.homedir()}\\.vscode\\extensions`

gulp.task('uninstall', () => {
    return del('/plylrnsdy.run-as-*/{.*,*.*,!(node_modules)/**}', {
        root: extDir,
        force: true
    })
})

gulp.task('install', ['uninstall'], () => {
    return gulp.src(['**/*', '.vsixmanifest',
            '!node_modules/**',
            '!out/test/**', '!src/**', '!test/**', 'gulpfile.js', '!tsconfig.json'])
        .pipe(copyTo(`${extDir}\\plylrnsdy.run-as-${version}`))
})