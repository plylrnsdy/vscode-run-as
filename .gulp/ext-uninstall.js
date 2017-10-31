const
    gulp = require('gulp'),
    del = require('del')


module.exports = (oldExt, extRoot) => {
    return () => {
        return del(oldExt, {
            root: extRoot,
            force: true
        })
    }
}