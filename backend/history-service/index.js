const express = require('express');
const cors = require("cors");
const app = express();
const port = 8005;

const db = require('./models');
const dbConfig = require('./config/db.config.js');

var corsOptions = {
  origin: true,
  methods: 'PUT, PATCH, POST, DELETE',
  allowedHeaders: 'Origin, Authorization, Content-Type, Accept, Cookie',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose.connection.on('error', console.error.bind(console, 'History database connection error:'));

db.mongoose
  .connect(dbConfig.CONNECTION_STRING, {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }).then(() => {
    console.log('Connected to the history database.');
  }).catch(err => {
    console.log('Connection to history database failed.', err);
    process.exit();
  });

app.get('/', (_, res) => { res.json({ message: 'History-service online and reporting.' }); });

require('./routes/history.routes')(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});