'use strict';

const gulp =              require("gulp");
const gutil =             require("gulp-util");
const webpack =           require("webpack");
const sass =              require('gulp-sass');
const cssmin =            require('gulp-minify-css');
const runSequence =       require('run-sequence');
const spawn =             require('child_process').spawn;
const tap =               require("gulp-tap");
const fs =                require("fs");
const WebpackDevServer =  require('webpack-dev-server');
const devConfig =         require('./dev.config.js');
const prodConfig =        require('./prod.config.js');
const path =              require('path');
const deepcopy =          require('deepcopy');

const webpackLogOptions = {
  colors: true,
  hash: false,
  timings: true,
  assets: false,
  chunks: true,
  chunkModules: false,
  modules: false,
  cached: false,
  reasons: false,
  source: false,
  chunkOrigins: false
};

const paths = {
  sassEntries: ['./src/scss/entries/**/*.scss'],
  sassSrc: ['./src/scss/**/*.scss', './src/css/**/*.css'],
  sassDest: './public/compiled/css'
};

function currentTime() {
  var date = new Date();
  var minutes = String(date.getMinutes());
  var seconds = String(date.getSeconds());

  minutes = (minutes.length === 1) ? '0' + minutes : minutes;
  seconds = (seconds.length === 1) ? '0' + seconds : seconds;
  return gutil.colors.cyan(date.getHours() + ':' + minutes + ':' + seconds);
}

function logFile(file) {
  gutil.log(
    gutil.colors.cyan(currentTime()),
    gutil.colors.green('Wrote file:'),
    gutil.colors.magenta(file.path.replace(process.cwd(), '.'))
  );
}

function runWebpack(config, cb) {
  return webpack(config, function (err, stats) {
    if (err) {
      gutil.error("[webpack] - build error", err);
      cb(err);
      return;
    }
    if (stats.hasErrors()) {
      var jsonStats = stats.toJson();
      gutil.log("[webpack] - stats has errors", jsonStats.errors);
      cb(jsonStats);
      return;
    }
    gutil.log("[webpack]", stats.toString(webpackLogOptions));
    cb();
  });
}

gulp.task("webpack", function(cb) {
  const config = deepcopy(devConfig);
  runWebpack(config, cb);
});

gulp.task("build", function(cb) {
  const config = deepcopy(prodConfig);
  runWebpack(config, cb);
});

gulp.task('webpack-dev-server', function () {
  const compiler = webpack(devConfig);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    contentBase: 'public',
    stats: webpackLogOptions,
    historyApiFallback: true,
    publicPath: devConfig.output.publicPath,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
  server.listen(8901, "localhost", function (err) {
    if (err) {
      throw new gutil.PluginError("webpack-dev-server", err);
    }
    // Server listening
    gutil.log("[webpack-dev-server]", "Listening on localhost:8901");
  });
});

// Sass
gulp.task('sass', function () {
  return gulp.src(paths.sassEntries)
    .pipe(sass({
      errLogToConsole: true,
      sourceComments: 'map'
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.sassDest))
    .pipe(tap(logFile));
});

gulp.task('dev-javascript', function (cb) {
  gulp.watch(["src/**/*"], ["webpack"]);
  gulp.watch(paths.sassSrc, ['sass']);
  runSequence(['webpack', 'webpack-dev-server', 'sass'], cb);
});

gulp.task('build-prod', function (cb) {
  runSequence(['build', 'sass'], cb);
});

gulp.task('default', function (cb) {
  runSequence('dev-javascript', cb);
});
