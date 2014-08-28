var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');

// sass/scss
var compass = require('gulp-compass');

// images
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

// concat, minify
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var filesize = require('gulp-filesize');
var domSrc = require('gulp-dom-src');
var cheerio = require('gulp-cheerio');
var clean = require('gulp-clean');


var filefolder = {
    'img': 'img/**/*',
    'js': 'js/**/*.js',
    'html': 'html/**/*.html',
    'css': 'css/**/*.css',
    'sass': 'sass/**/*.{sass, scss}',
};

var indexPath = 'html/index.html';

var watchStatus = {
    'isAdded': function(file) {
        return file.event === 'added';
    },
    'isChanged': function(file) {
        return file.event == 'changed';
    },
    'isDeleted': function(file) {
        return file.event == 'deleted';
    },
    'isNotDeleted': function(file) {
        return file.event != 'deleted';
    }
};

gulp.task('compass', function() {
    gulp.src(filefolder.sass)
        .pipe(watch({
            'emit': 'all',
            'glob': filefolder.sass
        }))
        .pipe(plumber())
        .pipe(filter(watchStatus.isNotDeleted))
        .pipe(compass({
            config_file: './config.rb',
            css: 'css',
            sass: 'sass'
        }))
        .pipe(gulp.dest('css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('browser-sync', function() {

    gulp.src([
        filefolder.html,
        filefolder.css,
        filefolder.js,
        filefolder.img
    ])
    .pipe(plumber())
    .pipe(watch({
        'emit': 'all',
        'glob': [
            filefolder.html,
            filefolder.css,
            filefolder.js,
            filefolder.img
        ]
    })).pipe(reload({
        stream: true
    }));

    browserSync.init(null, {
        server: {
            baseDir: './',
            directory: true
        },
        debugInfo: false,
        open: false,
        browser: ["google chrome", "firefox"],
        injectChanges: true,
        notify: true
    });
});



gulp.task('concat-js', function() {

    gulp.src('dist/js/**/*', {
        read: false
    }).pipe(clean());

    return domSrc({
        file: indexPath,
        selector: 'script',
        attribute: 'src'
    })
        .pipe(concat('dist.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(filesize())
        .on('error', gutil.log);
});

gulp.task('concat-css', function() {

    gulp.src('dist/css/**/*', {
        read: false
    }).pipe(clean());

    return domSrc({
        file: indexPath,
        selector: 'link',
        attribute: 'href'
    })
        .pipe(concat('dist.css'))
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(filesize())
        .on('error', gutil.log);
});


gulp.task('minify-js', function() {

    gulp.src('dist/js/**/*', {
        read: false
    }).pipe(clean());

    return domSrc({
        file: indexPath,
        selector: 'script',
        attribute: 'src'
    })
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(filesize())
        .on('error', gutil.log);
});

gulp.task('minify-css', function() {

    gulp.src('dist/css/**/*', {
        read: false
    }).pipe(clean());

    return gulp.src('dist/css/**/*', {
        read: false
    })
        .pipe(clean())
        .domSrc({
            file: indexPath,
            selector: 'link',
            attribute: 'href'
        })
        .pipe(minifyCSS({
            keepBreaks: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(filesize())
        .on('error', gutil.log);
});

gulp.task('minify-html', function() {

    gulp.src('dist/html/**/*', {
        read: false
    }).pipe(clean());

    return gulp.src(indexPath)
        .pipe(cheerio(function($) {
            $('script').remove();
            $('link').remove();
            $('body').append('<script src="js/dist.js"></script>');
            $('head').append('<link rel="stylesheet" href="css/dist.css">');
        }))
        .pipe(minifyHTML({
            comments: true,
            spare: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(filesize())
        .on('error', gutil.log);
});

gulp.task('move-html', function() {

    gulp.src('dist/html/**/*', {
        read: false
    }).pipe(clean());

    return gulp.src(indexPath)
        .pipe(cheerio(function($) {
            $('script').remove();
            $('link').remove();
            $('body').append('<script src="js/dist.js"></script>');
            $('head').append('<link rel="stylesheet" href="css/dist.css">');
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(filesize())
        .on('error', gutil.log);
});


gulp.task('minify-img', function() {

    gulp.src('dist/img/**/*', {
        read: false
    }).pipe(clean());

    return gulp.src(filefolder.img)
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('dist/img'))
        .on('error', gutil.log);
});

gulp.task('sass', ['compass']);
gulp.task('default', ['sass']);
gulp.task('livereload', ['browser-sync', 'default']);
gulp.task('dist', ['concat-js', 'concat-css', 'move-html']);
gulp.task('dist-noncon', ['minify-js', 'minify-css', 'move-html']);
gulp.task('dist-img', ['dist', 'minify-img']);
gulp.task('dist-noncon-img', ['dist-noncon', 'minify-img']);
