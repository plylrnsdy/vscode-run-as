const
    os = require('os'),
    { name, version, publisher } = require('./package.json'),
    gulp = require('gulp'),
    shell = require('gulp-shell')

const
    extRoot = `${os.homedir()}\\.vscode\\extensions`,
    oldExt = `/${publisher}.${name}-*/{.*,*.*,!(node_modules)/**}`,
    newExt = `${extRoot}/${publisher}.${name}-${version}`
const
    extension = [
        '**/*', '.vsixmanifest',
        '!node_modules/**',
        '!out/test/**', '!src/**', '!test/**', 'gulpfile.js', '!tsconfig.json'
    ]


gulp.task('compile',                         require('./.gulp/compile-ts')())

gulp.task('compile:watch', ['compile'],      require('./.gulp/watcher')({ globs: '{src,test}/**/*.ts', outExtension: '.js' }, ['compile']))

gulp.task('uninstall',                       require('./.gulp/delete')(oldExt, extRoot))

gulp.task('install:copy',  ['uninstall'],    require('./.gulp/copy')(extension, newExt))

gulp.task('install',       ['install:copy'], shell.task('npm install --production', { cwd: newExt }))

gulp.task('install:watch',                   require('./.gulp/watcher')({ globs: 'out/src/**/*' }, ['install']))