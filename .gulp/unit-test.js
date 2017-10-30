const
    gulp = require('gulp'),
    mocha = require('gulp-mocha')

// 单元测试
module.exports = () => {
    return () => {
        return gulp.src(['test/**/*.spec.js'])
            .pipe(mocha())
    }
}