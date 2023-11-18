const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../models");
const { MongoMemoryServer } = require('mongodb-memory-server');

const startMongoStub = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoServer.getNewPort(9005);
  const mongoUri = mongoServer.getUri();
  await db.mongoose.connect(mongoUri).then(() => {
    console.log("Successfully connected to Mongo Memory Server.");
  });
}

startMongoStub();
require('../routes/history.routes')(app);

module.exports = app;