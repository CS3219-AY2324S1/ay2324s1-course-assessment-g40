const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

var corsOptions = {
  origin: true,
  methods: 'PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept, Cookie',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    name:"a_session",
    keys:["COOKIE_SECRET"],
    httpOnly:true
}));

//routes
app.get("/", (req, res) => {
    res.json({message:"route_message says hi!"});
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

//db
const db = require("./models");
const Role = db.role;
const dbConfig = require('./config/db.config');

db.mongoose
  .connect(dbConfig.CONNECTION_STRING, {
      useNewUrlParser:true,
      useUnifiedTopology:true
  }).then(() => {
      console.log("Successfully connected to MongoDB.");
      initial();
  }).catch(err => {
      console.error("Connection error", err);
      process.exit();
  });


//set port & listen for requests
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}.`);});

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