const
    gulp = require('gulp'),
    del = require('del')


module.exports = (patterns, root) => {
    return () => {
        return del(patterns, {
            root: root,
            force: true
        })
    }
}