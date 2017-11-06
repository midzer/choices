const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const wrapperPlugin = require('wrapper-webpack-plugin');
const banner = `/*! ${ pkg.name } v${ pkg.version } | (c) ${ new Date().getFullYear() } ${ pkg.author } | ${ pkg.homepage } */ \n`;

module.exports = (env) => {
  const minimize = !!(env && env.minimize);

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
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
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
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src/scripts/src'),
        options: {
          babelrc: false,
          presets: [['es2015', { modules: false }], 'stage-2'],
        },
      }],
    },
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

  return config;
};
