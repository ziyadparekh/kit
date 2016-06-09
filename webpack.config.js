/* eslint strict: 0 */
'use strict';

const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, './public'),
    filename: 'compiled/js/[name].js',
    sourceMapFilename: '/' + '[file].map'
  },
  resolve: {
    unsafeCache: true,
    root: path.resolve(__dirname, './src/js'),
    alias: {
      '@templates': path.resolve(__dirname, './public/templates'),
      '@scss': path.resolve(__dirname, './src/scss')
    },
    extensions: ['', '.js', '.jsx', '.json', '.html'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  resolveLoader: { root: path.join(__dirname, "node_modules") },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      { 
        test : /\.js$/, 
        loader: 'jstransform-loader'
      }
    ]
  },
  plugins: [

  ],
  externals: [
    // put your node 3rd party libraries which can't be built with webpack here (mysql, mongodb, and so on..)
  ]
};