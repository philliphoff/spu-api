var del = require('delete');
var gulp = require('gulp');
var path = require('path');
var ts = require('gulp-typescript');

const libDir = path.join(__dirname, 'lib');

gulp.task('clean', function clean() {
    del.sync([libDir]);
});

gulp.task('build', ['clean'], function build() {
    var tsProject = ts.createProject('tsconfig.json');

    return gulp
        .src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(libDir));
});

gulp.task('default', ['build']);
