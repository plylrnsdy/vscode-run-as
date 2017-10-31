const
    gulp = require('gulp'),
    copyTo = require('gulp-copy')

const
    extension = [
        '**/*', '.vsixmanifest',
        '!node_modules/**',
        '!out/test/**', '!src/**', '!test/**', 'gulpfile.js', '!tsconfig.json'
    ]

module.exports = (newExt) => {
    return () => {
        return gulp.src(extension)
            .pipe(copyTo(newExt))
    }
}