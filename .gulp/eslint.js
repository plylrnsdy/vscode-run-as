const
    gulp = require('gulp'),
    eslint = require('gulp-eslint')


// ES6 语法检查（使用 VS Code 插件 ESLint 可以实时进行语法检查）
module.exports = () => {
    return () => {
        // eslint 配置，进行语法检查的文件目录。排除 node_modules 下的全部文件。
        return gulp.src('src/**/*.es6')
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError())
    }
}