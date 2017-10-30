const
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps')


// ES6 编译为 ES5，同时生成 sourcemaps
module.exports = () => {
    return () => {
        return gulp.src('src/**/*.es6')
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('out/src'))
    }
}