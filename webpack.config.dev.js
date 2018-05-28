const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/scripts/choices',
  ],
  output: {
    path: path.resolve('public'),
    filename: 'choices.min.js',
    publicPath: 'http://localhost:3001/assets/scripts/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        query: {
          configFile: '.eslintrc',
        },
      },
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
    ],
  },
};
