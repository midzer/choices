const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const wrapperPlugin = require('wrapper-webpack-plugin');
const banner = `/*! ${ pkg.name } v${ pkg.version } | (c) ${ new Date().getFullYear() } ${ pkg.author } | ${ pkg.homepage } */ \n`;
const minimize = process.argv.includes('--minimize');

const config = {
  devtool: minimize ? false : 'cheap-module-source-map',
  entry: [
    './src/scripts/src/choices'
  ],
  output: {
    path: path.join(__dirname, '/src/scripts/dist'),
    filename: minimize ? 'choices.min.js' : 'choices.js',
    publicPath: '/src/scripts/dist/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  libraryTarget: 'umd',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new wrapperPlugin({
      header: banner,
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src/scripts/src')
    }]
  }
};

if (minimize) {
  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    mangle: true,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true
    }
  }));
}

module.exports = config;
