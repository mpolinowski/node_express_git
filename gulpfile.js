var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream; /*Use wiredep to inject css/js dependencies to views e.g. bootstrap*/
    var inject = require('gulp-inject'); /* Use gulp-inject to inject our personal css/js dependencies to views */

    var injectSrc = gulp.src(['./public/css/*.css', /* Tell gulp-inject where our personal css/js dependencies are located */
        './public/js/*.js'
    ], {
        read: false /* We only need the path not content */
    });

    var injectOptions = {
        ignorePath: '/public' /* Tell gulp-inject to use a path relative to /public */
    };

    var options = {
        bowerJson: require('./bower.json'), /*Tell wiredep to check dependencies from bower e.g. bootstrap*/
        directory: './public/lib', /*Tell wiredep to find dependencies in the lib directory*/
        ignorePath: '../../public' /*The path to the css/js files has to ignore ../../public*/
    };

    return gulp.src('./src/views/*.ejs')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions)) /* Use gulp-inject to inject our personal css/js dependencies to views */
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['inject'], function() { /* Create a 'serve' task to automatically execute the 'inject' function above on start-up */
    var options = { /* In the line above we used an Object for the 'inject' function - here you can add more functions to be executed */
        script: 'app.js',  /* 'serve' starts our app.js on 'PORT' and nodemon restarts it when 'jsFiles' are changed */
        delayTime: 1,
        env: {  /* Environment variables e.g. database connection strings */
            'PORT': 8080
        },
        watch: jsFiles
    };

    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting...');
        });
});
