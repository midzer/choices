/* eslint-disable no-console,global-require,import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.dev');

  console.log('Compiling bundle... 👷🏽');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
  }));
}

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at ${port} 👂`);
});
