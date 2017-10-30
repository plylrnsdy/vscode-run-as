const
    gulp = require('gulp'),
    extend = require('extend'),
    changed = require('gulp-changed'),
    tsc = require('gulp-typescript')

module.exports = (target = 'es6') => {

    let tsconfig = extend(
        require('../tsconfig.json').compilerOptions,
        { target }
    )

    return () => {
        return gulp.src('{src,test}/**/*.ts')
            .pipe(changed('out', { extension: '.js' }))
            .pipe(tsc(tsconfig))
            .pipe(gulp.dest('out'))
    }
}