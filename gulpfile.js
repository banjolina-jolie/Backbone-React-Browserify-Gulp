var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var historyApiFallback = require('connect-history-api-fallback');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');


// Clean
gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

// Connect
gulp.task('connect', function() {
    var livereload = true;
    connect.server({
        root: ['dist', 'app'],
        port: 8008,
        livereload: livereload,
        keepalive: true,
        middleware: function(connect, opt) {
            return [
              historyApiFallback // make all routes match on app init
            ];
        }
    });
});

// Browserify
gulp.task('browserify', function () {
    var browserified = transform(function(filename) {
        var b = browserify(filename, {noParse: ['jquery']});
        return b.bundle();
    });

    return gulp.src(['./app/main.js'])
        .pipe(browserified)
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
});


// HTML
gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});


// Sass
gulp.task('sass', function() {
    return gulp.src('./app/styles/main.scss')
        .pipe(sass())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

// Watch
gulp.task('watch', function () {
    gulp.watch(['./app/**/*.js', './app/**/*.jsx', './app/**/*.html'], ['browserify']);
    gulp.watch(['./app/styles/**/*.scss'], ['sass']);
});

var defaultTasks = ['clean', 'browserify', 'sass', 'connect', 'watch'];

gulp.task('default', defaultTasks);
