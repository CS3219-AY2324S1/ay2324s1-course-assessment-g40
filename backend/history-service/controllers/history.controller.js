const db = require('../models');
const History = db.histories;

exports.findOne = (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.params.userId;
  var condition = questionId ? { questionId: questionId, userId: userId } : {};

  History.find(condition)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `An error occured while retrieving the history record for user ${userId} for question ${questionId}.`
      })
      return;
    });
};

exports.create = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({message: 'History missing.'});
    return;
  }
  const history = new History({
    questionId: req.body.questionId,
    language: req.body.language,
    solution: req.body.solution,
    userId: req.body.userId,
    userId2: req.body.user_id2,
  });
  history
    .save(history)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'An error occured while creating the history record.'
      })
    });
  
  return;
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Details required to update.'
    });
  }

  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  History.findOneAndUpdate(condition, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Unable to update History with questionId ${questionId}. Not found.`
        });
        return;
      }
      res.send({ message: 'History updated successfully.'});
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error updating History with questionId ${questionId}.`
      });
      return;
    });
};

exports.delete = (req, res) => {
  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  History.findOneAndDelete(condition, req.body, { new: true })
    .then(data => {
      res.send({ message: `History for question ${questionId} deleted successfully.`});
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting histories of question ${questionId}.`
      });
      return;
    });
};

exports.findAll = (req, res) => {
  History.find({})
  .then(data => {
    res.send(data);
    return;
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "An error occurred while retrieving all histories."
    })
    return;
  })
}

exports.findUserHistory = (req, res) => {
  const userId = req.params.userId;
  var condition = userId ? { userId: userId } : {};
  History.find(condition)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `An error occured while retrieving history records for user ${userId}.`
      })
      return;
    });
};

exports.findQuestionHistory = (req, res) => {
  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  History.find(condition)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `An error occured while retrieving the history record for question ${questionId}.`
      })
      return;
    });
};


exports.deleteAll = (req, res) => {
  History.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} histories deleted successfully.`});
      return;
    })
    .catch(err =>{
      res.status(500).send({
        message: err.message || 'Error deleting all histories.'
      });
      return;
    });
};
