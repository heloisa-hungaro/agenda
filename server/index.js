'use strict';

const express = require('express');
const router = require('./src/routes/routes');

const port = 4000;
const app = express();

app.use(express.json());
app.use(router);

const server = app.listen(port, (error) => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server is listening on port ${server.address().port}`);
});