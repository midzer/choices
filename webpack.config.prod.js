var path = require('path');
var package = require('./package.json');
var webpack = require('webpack');
var wrapperPlugin = require('wrapper-webpack-plugin');
var banner = `/*! ${ package.name } v${ package.version } | (c) ${ new Date().getFullYear() } ${ package.author } | ${ package.homepage } */ \n`

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        './assets/scripts/src/choices'
    ],
    output: {
        path: path.join(__dirname, '/assets/scripts/dist'),
        filename: 'choices.min.js',
        publicPath: '/assets/scripts/dist/'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false,
                screw_ie8: true
            }
        }),
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
            include: path.join(__dirname, 'assets/scripts/src')
        }]
    }
};