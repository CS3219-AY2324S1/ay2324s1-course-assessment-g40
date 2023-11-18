const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.questions = require("./question.model.js")(mongoose);
db.counters = require("./counter.model.js")(mongoose);
db.tags = require("./tag.model.js")(mongoose)
db.categories = require("./category.model.js")(mongoose)

module.exports = db;