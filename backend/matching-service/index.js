const express = require('express');
const cors = require('cors');
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
  origin: true,
  methods: 'PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept, Cookie',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  maxAge:24*60*60,
  name:"a_session",
  keys:["COOKIE_SECRET"],
  httpOnly:true
}));

const PORT = 8003;

app.get('/', (_, res) => {
  res.json({ message: 'Hello from matching-service.' });
});

require('./routes/matching.routes')(app);

app.listen(PORT, () => {
  console.log(`matching-service listening on port ${PORT}`);
});