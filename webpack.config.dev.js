const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

module.exports = merge(
  baseConfig,
  /** @type {import('webpack').Configuration} */ ({
    mode: 'development',
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'choices.min.js',
      publicPath: 'http://localhost:3001/assets/scripts/',
    },
    devtool: 'source-map',
    entry: ['webpack/hot/dev-server', 'webpack-hot-middleware/client'],
    plugins: [new HotModuleReplacementPlugin()],
  })
);
