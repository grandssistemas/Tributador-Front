var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var ngTemplates = require('gulp-ng-templates');

gulp.task('js', ['templates'], function () {
    gulp.src([
            'templates.min.js',
            'app/**/services/module.js',
            'app/**/services/**/*.js',  
            'app/**/controllers/module.js',            
            'app/**/controllers/**/*.js',                      
            'app/**/module.js',
            'app/**/*.js',
            'app/app.js'
        ])
        .pipe(concat('tributador.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('.'))
});

gulp.task('js-dev', ['templates'], function () {
    gulp.src([
            'templates.min.js',
            'app/**/services/module.js',
            'app/**/services/**/*.js',
            'app/**/controllers/module.js',
            'app/**/controllers/**/*.js',
            'app/**/module.js',
            'app/**/*.js',
            'app/app.js'
        ])
        .pipe(concat('tributador.min.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('.'))
});

gulp.task('templates', function () {
    return gulp.src([
            './app/**/*.html',
                './base.html'
        ])
        .pipe(ngTemplates('tributador.templates'))
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['templates', 'js']);
gulp.task('dev', ['templates', 'js-dev']);

