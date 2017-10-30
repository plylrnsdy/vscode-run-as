const
    del = require('del')

// 清理上一次构建的项目文件
module.exports = () => {
    return () => {
        return del(
            ['out/**/*'],
            { force: true }
        )
    }
}