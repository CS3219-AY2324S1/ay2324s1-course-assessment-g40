const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('../routes/matching.routes')(app);

module.exports = app;