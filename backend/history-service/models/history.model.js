const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    questionId: String,
    language: String,
    solution: String,
    userId: String,
    userId2: String,
});

const History = mongoose.model('History', historySchema);
module.exports = History;