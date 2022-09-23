var gulp = require('gulp');

var srcDir = './build'
var dstDir = './dist'


function copyJS() {
    // And this bit moves the JavaScript
    return gulp.src(`${srcDir}/**/*.js`)
        .pipe(gulp.dest(`${dstDir}`));

}

function copyDeclarations() {
    // This bit moves type definitions
    return gulp.src(`${srcDir}/**/*.d.ts`)
        .pipe(gulp.dest(`${dstDir}`));

}

function copyPackageJson() {
    return gulp.src('./package.json')
        .pipe(gulp.dest(`${dstDir}`));
}


exports.default = gulp.series(copyJS, copyDeclarations, copyPackageJson)