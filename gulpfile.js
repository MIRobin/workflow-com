/*******************************************************************************
1. DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),                             // gulp core
    less = require("gulp-less-sourcemap"),              // gulp less wit sourcemap
    uglify = require('gulp-uglify'),                    // uglifies the js
   // jshint = require('gulp-jshint'),                    // check if js is ok
    rename = require("gulp-rename"),                    // rename files
    concat = require('gulp-concat'),                    // concatinate js
    notify = require('gulp-notify'),                    // send notifications to osx
    //plumber = require('gulp-plumber'),                  // disable interuption
   // stylish = require('jshint-stylish'),                // make errors look good in shell
    minifycss = require('gulp-minify-css'),             // minify the css files
    // browserSync = require('browser-sync');              // inject code to all devices
    connect = require("gulp-connect");
    //autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes


/*******************************************************************************
2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    html_src : '*.html',                        // all html files
    less_src : 'less/**/**/*.less',                        // all less files
    css_dest : 'css',                                   // where to put minified css
    // js_lint_src : [                                     // all js that should be linted
    //     'js/build/app.js',
    //     'js/build/custom/switch.js',
    //     'js/build/custom/scheme-loader.js'
    // ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        'js/custom_one.js',
        'js/custom_two.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        'js/lib/custom_cat_one.js',
        'js/lib/custom_cat_two.js'
    ],
    js_dest : 'js'                                      // where to put minified js
};


/*******************************************************************************
3. LESS TASK
*******************************************************************************/
gulp.task('less', function () {
  gulp.src('less/*.less')                                //get the files
    .pipe(less({                                         //make surce maping
      generateSourceMap: true, // default true
      sourceMapBasepath: 'less/'

    }))
    //.pipe(minifycss())
    .pipe(gulp.dest(target.css_dest))                    //where to put the file
    .pipe(notify({ message: 'Less processed!'}))    // notify when done
    .pipe(connect.reload());
    
});



/*******************************************************************************
4. JS TASKS
*******************************************************************************/

// lint my custom js
// gulp.task('js-lint', function() {
//     gulp.src(target.js_lint_src)                        // get the files
//         .pipe(jshint())                                 // lint the files
//         .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
// });

// minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(target.js_uglify_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        // .pipe(rename(function(dir,base,ext){            // give the files a min suffix
        //     var trunc = base.split('.')[0];
        //     return trunc + '.min' + ext;
        // }))
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({ message: 'JS processed!'}))
        .pipe(connect.reload());     // notify when done
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    gulp.src(target.js_concat_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(concat('scripts.min.js'))                 // concatinate to one file
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({message: 'JS processed!'}))
        .pipe(connect.reload());                        // notify when done
});


/*******************************************************************************
5. Connect
*******************************************************************************/

// gulp.task('browser-sync', function() {
//     browserSync.init(['css/*.css', 'js/*.js'], {        // files to inject
//         proxy: {
//             host: 'localhost',                          // development server
//             port: '8080'                                // development server port
//         }
//     });
// });

gulp.task("connect", function(){
    connect.server(
        {
    port: 8000,
    livereload: true
  });
}); 





/*******************************************************************************
1. HTML reload
*******************************************************************************/
gulp.task('html', function () {
  gulp.src('*.html')
    .pipe(connect.reload());
});


/*******************************************************************************
1. GULP TASKS
*******************************************************************************/
// gulp.task("watch", function(){
//    gulp.watch("less/*.less", ["less"]);
//    gulp.watch("js/**/*.js", ["js-concat"]);
//    gulp.watch(['*.html'], ['html']);


// });

gulp.task("default", ["js-concat", "less", "watch", "connect"]);

gulp.task('default', function() {
    gulp.run('less',  'js-concat', 'connect');
    gulp.watch('less/**/*.less', function() {
        gulp.run('less');
    });
    // gulp.watch(target.js_lint_src, function() {
    //     gulp.run('js-lint');
    // });
    // gulp.watch(target.js_minify_src, function() {
    //     gulp.run('js-uglify');
    // });
    gulp.watch(target.js_concat_src, function() {
        gulp.run('js-concat');
    });
    gulp.watch(target.html_src, function() {
        gulp.run('html');
    });



});