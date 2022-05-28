const path = require('path');
const { BannerPlugin } = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.config.base');
const { name, version, author, homepage } = require('./package.json');

const prodConfig = merge(
  baseConfig,
  {
    mode: 'production',
    output: {
      path: path.join(__dirname, '/public/assets/scripts'),
      publicPath: '/public/assets/scripts/',
    },
    plugins: [
      new BannerPlugin(
        `${name} v${version} | © ${new Date().getFullYear()} ${author} | ${homepage}`,
      ),
    ],
  }
);

module.exports = [
  merge(
    prodConfig,
    {
      output: { filename: 'choices.js', libraryTarget: 'umd' },
      optimization: { minimize: false },
    }
  ),
  merge(
    prodConfig,
    { output: { filename: 'choices.min.js' } },
  )
];
