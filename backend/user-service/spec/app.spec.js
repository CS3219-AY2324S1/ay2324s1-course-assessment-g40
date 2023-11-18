const express = require("express");
const cookieSession = require("cookie-session");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    name:"a_session",
    keys:["COOKIE_SECRET"],
    httpOnly:true
}));

require('../routes/auth.routes')(app);
require('../routes/user.routes')(app);

//db
const db = require("../models");

const Role = db.role;
const { MongoMemoryServer } = require('mongodb-memory-server');

const startMongoStub = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoServer.getNewPort(9001);
  const mongoUri = mongoServer.getUri();
  await db.mongoose.connect(mongoUri).then(() => {
    console.log("Successfully connected to Mongo Memory Server.");
  });
}

startMongoStub();
initial();

function initial() {
  Role.estimatedDocumentCount().then((count) => {
    if (count === 0) {
      new Role({
        name: "user"
      }).save().then(() => {
        console.log("added 'user' to roles collection");
      }).catch(err => {console.log("error", err);});

      new Role({
        name: "moderator"
      }).save().then(() => {console.log("added 'moderator' to roles collection");})
      .catch(err => {console.log("error", err);});

      new Role({
        name: "admin"
      }).save().catch(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
module.exports = app;