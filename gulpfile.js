var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var del = require('del');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var usemin = require('gulp-usemin');
var htmlmin = require('gulp-htmlmin');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var shell = require('gulp-shell');
var modRewrite = require('connect-modrewrite');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');

var env;

gulp.task('clean:css', function () {
    del.sync('app/styles/*.css');
});

gulp.task('clean:build', function () {
    del.sync('dist/', {force: true});
});

gulp.task('less', ['clean:css'], function () {
    var stream = gulp
            .src(['app/styles/main.less', 'app/styles/materialFix.less'])
            .pipe(less())
            .pipe(gulp.dest('app/styles/'));
    return stream;
});

gulp.task('watch', function () {
    gulp
        .src(['app/styles/**/*.less', '!app/styles/materialFix.less'], {read: false})
        .pipe(watch(['app/styles/**/*.less', '!app/styles/materialFix.less'], function () {
            return gulp
                .src('app/styles/main.less')
                .pipe(less())
                .pipe(gulp.dest('app/styles/'))
                .pipe(connect.reload());
        }));

    gulp
        .src('app/styles/materialFix.less')
        .pipe(watch('app/styles/materialFix.less'))
        .pipe(less())
        .pipe(gulp.dest('app/styles/'))
        .pipe(connect.reload());

    gulp
        .src(['app/scripts/**/*.js', 'app/**/*.html'])
        .pipe(watch(['app/scripts/**/*.js', 'app/**/*.html']))
        .pipe(plumber())
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: './app',
        port: 9000,
        livereload: true,
        middleware: function (connect, o) {
            return [
                (function () {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse('http://localhost:3000/api');
                    options.route = '/api';
                    return proxy(options);
                })(),
                modRewrite([
                    '!\\.html|\\.js|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.gif|\\.eot|\\.woff|\\.ttf|\\.svg$ /index.html'
                ])
            ];
        }
    });
});

gulp.task('minify', ['clean:build', 'cdn', 'less'], function () {
    gulp
        .src('app/views/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/views'));

    gulp
        .src('app/index.html')
        .pipe(usemin({
            js: [uglify, rev],
            css: [minifyCss, 'concat', rev]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyfonts', function () {
    gulp
        .src('app/styles/fonts/*')
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('env:dev', function () {
    env = 'development';
});

gulp.task('env:build', function () {
    env = 'production';
});

gulp.task('cdn', function () {
    var cdn = require('./app/scripts/config/cdn.json');
    return ngConstant({
        name: 'bdCDN',
        constants: cdn[env],
        stream: true
    })
    .pipe(rename('cdn.js'))
    .pipe(gulp.dest('app/scripts/config'));
});

gulp.task('server', ['env:dev', 'cdn', 'less', 'connect', 'watch']);
gulp.task('build', ['env:build', 'clean:build', 'cdn', 'minify', 'copyfonts']);
gulp.task('deploy', ['build'], shell.task('bash ./update.sh aniquo.com'));
