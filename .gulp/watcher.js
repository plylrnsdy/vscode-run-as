const
    gulp = require('gulp'),
    fs = require('fs'),
    path = require('path')

module.exports = ({ globs, outExtension }, tasks) => {
    return () => {
        return gulp.watch(globs, tasks)
            .on('change', (e) => {
                if (e.type === 'deleted') {
                    // 计算相对路径
                    let outFile = path.join(__dirname, '../out', path.relative('./', e.path).replace(/\.[^.]+$/, outExtension))
                    fs.existsSync(outFile) && fs.unlinkSync(outFile)
                }
            })
    }
}