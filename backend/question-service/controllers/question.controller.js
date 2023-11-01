const db = require('../models');
const Question = db.questions;
const Counter = db.counters;

exports.create = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({message: 'Question details missing.'});
    return;
  }

  Counter.findOneAndUpdate({ id: "questionId" }, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true })
  .then(count => {
    const question = new Question({
      questionId: count.seq,
      questionTitle: req.body.questionTitle,
      questionDescription: req.body.questionDescription,
      questionCategory: req.body.questionCategory,
      questionComplexity: req.body.questionComplexity,
      questionTags: req.body.questionTags
    });
  
    question
      .save(question)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'An error occured while creating the Question.'
        })
      });
  }).catch(err => {
    console.log(err);
  })

  return;
};

exports.findAll = (req, res) => {
  Question.find({})
  .then(data => {
    res.send(data);
    return;
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "An error occurred while retrieving all questions"
    })
    return;
  })
}

exports.findAllByCondition = (req, res) => {
  Question.find({$text: {"$search": req.params.questionTitle}})
  .then(data => {
    res.send(data);
    return;
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "an error occurred while searching"
    })
    return;
  })
}

exports.findOne = (req, res) => {
  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  Question.findOne(condition)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `An error occured while retrieving the question with questionId ${questionId}.`
      })
      return;
    });
};

exports.findRandomByComplexity = (req, res) => {
  const questionComplexity = req.params.questionComplexity;
  var condition = questionComplexity ? { questionComplexity } : {};

  Question.find(condition)
  .then(data => {
    if (data.length > 0) {
      randomQuestion = data[Math.floor(Math.random() * data.length)];
      res.send(randomQuestion);
    } else {
      res.status(404).send({
        message: err.message || `No questions with complexity ${questionComplexity} found.`
      })  
    }
    return;
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || `An error occurred while retrieving a random question with complexity ${questionComplexity}.`
    })
    return;
  })
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Details required to update.'
    });
  }

  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  Question.findOneAndUpdate(condition, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Unable to update Question with questionId ${questionId}. Not found.`
        });
        return;
      }
      res.send({ message: 'Question updated successfully.'});
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error updating Question with questionId ${questionId}.`
      });
      return;
    });
};

exports.delete = (req, res) => {
  const questionId = req.params.questionId;
  var condition = questionId ? { questionId: questionId } : {};

  Question.findOneAndDelete(condition, req.body, { new: true })
    .then(data => {
      // if (!data) {
      //   res.status(404).send({
      //     message: `Unable to delete Question with questionId ${questionId}. Not found.`
      //   });
      //   return;
      // } why do we need btw
      res.send({ message: 'Question deleted successfully.'});
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error deleting Question with questionId ${questionId}.`
      });
      return;
    });
};

exports.deleteAll = (req, res) => {
  Question.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} Questions deleted successfully.`});
      return;
    })
    .catch(err =>{
      res.status(500).send({
        message: err.message || 'Error deleting all questions.'
      });
      return;
    });
};
