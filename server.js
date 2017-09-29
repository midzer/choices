let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config.dev');
let opn = require('opn');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  quiet: true, // lets WebpackDashboard do its thing
}).listen(3001, 'localhost', (err, result) => {
  if (err) console.log(err);
  opn('http://localhost:3001');
  console.log('Listening at localhost:3001');
});
