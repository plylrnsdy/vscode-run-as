const
    gulp = require('gulp'),
    copyTo = require('gulp-copy')


module.exports = (src, dest) => {
    return () => {
        return gulp.src(src)
            .pipe(copyTo(dest))
    }
}