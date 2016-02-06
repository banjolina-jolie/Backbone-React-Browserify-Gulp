var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var historyApiFallback = require('connect-history-api-fallback');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var preprocess = require('gulp-preprocess');

if(process.env.NODE_ENV !== 'production')
  require('dotenv').load();


// Clean
gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

// Connect
gulp.task('connect', function() {
    var livereload = process.env.NODE_ENV !== 'production' ? true : false;
    console.log("bring up web server on port " + process.env.PORT)
    connect.server({
        root: ['dist', 'app'],
        port: process.env.PORT,
        livereload: livereload,
        keepalive: true,
        // https: false,
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
        var b = browserify(filename);
        return b.bundle();
    });
    if (process.env.NODE_ENV !== 'production') {
        return gulp.src(['./app/main.js'])
            .pipe(browserified)
            // skip uglify in development
            .pipe(gulp.dest('./dist/js'))
            .pipe(connect.reload());
    } else {
        return gulp.src(['./app/main.js'])
            .pipe(browserified)
            .pipe(uglify())
            .pipe(gulp.dest('./dist/js'))
            .pipe(connect.reload());
    }
});

gulp.task('preprocess', function () {
    gulp.src('./app/index.html')
        .pipe(preprocess({context: { NODE_ENV: process.env.NODE_ENV }}))
        .pipe(gulp.dest('./dist/'));
});

// HTML
gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(preprocess({context: { NODE_ENV: process.env.NODE_ENV }}))
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

var defaultTasks = ['clean', 'preprocess', 'browserify', 'sass', 'connect'];

if (process.env.NODE_ENV !== 'production') {
    defaultTasks.push('watch');
}

gulp.task('default', defaultTasks);
