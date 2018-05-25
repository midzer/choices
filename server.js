/* eslint-disable no-console */
const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Listening at ${port}`);
});
