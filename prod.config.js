/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const baseConfig = require('./webpack.config')
const path = require('path');
const glob = require('glob');
const deepcopy = require('deepcopy');

let entries = {};

let g = new glob.Glob('./src/js/entries/**/*.js', {
  sync: true
});

g.found.forEach(function (file) {
  let outputFile = file.replace('./src/js/entries/', '').replace('.js', '');
  entries[outputFile] = path.resolve(__dirname, file);
});

// Dont mutate Base Config
const prodConfig = deepcopy(baseConfig);

prodConfig.devtool = 'source-map';
prodConfig.entry = entries;

prodConfig.plugins.push(
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    },
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
  }),
  // optimizations
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);

module.exports = prodConfig;

