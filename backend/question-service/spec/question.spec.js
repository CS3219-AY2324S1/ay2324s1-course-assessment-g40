const request = require('supertest');
const app = require('./app.spec.js');
const db = require("../models");

const Question = db.questions;  

describe('create function', () => {
  let question;
  beforeAll(() => {
    question = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard",
      questionTags: "A question tag."
    };
  });
  afterAll(async () => {
    await Question.deleteMany({});
  });

  it('should create a question', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send(question);
    expect(res.statusCode).toEqual(200);
    expect(res.body.questionId).toBe(String(question.questionId));
    expect(res.body.questionTitle).toBe(question.questionTitle);
    expect(res.body.questionDescription).toBe(question.questionDescription);
    expect(res.body.questionCategory[0]).toBe(question.questionCategory);
    expect(res.body.questionComplexity).toBe(question.questionComplexity);
    expect(res.body.questionTags[0]).toBe(question.questionTags);
    expect(res.body._id).toBeDefined();

    Question.findOne({ questionId: question.questionId }).then(data => {
      expect(data.questionId.toString()).toBe(String(question.questionId));
      expect(data.questionTitle.toString()).toBe(question.questionTitle);
      expect(data.questionDescription.toString()).toBe(question.questionDescription);
      expect(data.questionCategory.toString()).toBe(question.questionCategory);
      expect(data.questionComplexity.toString()).toBe(question.questionComplexity);
      expect(data.questionTags.toString()).toBe(question.questionTags);
      expect(data._id.toString()).toBe(res.body._id);
    });

  });

  it ('should not create a question if questionId already exists', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send(question);
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toContain('E11000 duplicate key error');
  });

  it ('should not create a question if question title already exists', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send({
        questionId: 2,
        questionTitle: "A question title.",
        questionDescription: "A question description.",
        questionCategory: "A question category.",
        questionComplexity: "Hard"
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toContain('E11000 duplicate key error');
  });

  it('should return error if questionTitle is not provided', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send({
        questionId: 1,
        questionDescription: "A question description.",
        questionCategory: "A question category.",
        questionComplexity: "Hard"
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("question validation failed: questionTitle: Path `questionTitle` is required.");
  });

  it('should return error if questionDescription is not provided', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send({
        questionId: 1,
        questionTitle: "A question title.",
        questionCategory: "A question category.",
        questionComplexity: "Hard"
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("question validation failed: questionDescription: Path `questionDescription` is required.");
  });

  it('should return error if questionComplexity is not provided', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send({
        questionId: 1,
        questionTitle: "A question title.",
        questionDescription: "A question description.",
        questionCategory: "A question category.",
      });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe("question validation failed: questionComplexity: Path `questionComplexity` is required.");
  });

  it('should return error if no body provided', async () => {
    const res = await request(app)
      .post('/question/auth/')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Question details missing.");
  });
}); 

describe('findAll function', () => {
  let question;
  beforeAll(() => {
    question = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard"
    };
  });

  afterAll(async () => {
    await Question.deleteMany({});
  });

  it('should return zero questions', async () => {
    const res = await request(app)
      .get('/question/all');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(0);
  });

  it('should return one question', async () => {
    const newQns = new Question(question);
    await newQns.save();

    const res = await request(app)
      .get('/question/all');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });
});

describe('findOne function', () => {
  let question;
  beforeAll(() => {
    question = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard",
      questionTags: "A question tag."
    };
  });

  afterAll(async () => {
    await Question.deleteMany({});
  });

  it('should return zero questions', async () => {
    const res = await request(app)
      .get('/question/' + question.questionId);

    expect(res.statusCode).toEqual(200);
    expect(res.body.questionId).toBeUndefined();
  });

  it('should return one question', async () => {
    const newQns = new Question(question);
    await newQns.save();

    const res = await request(app)
      .get('/question/' + question.questionId);

    const validateQns = await Question.findOne({ questionId: question.questionId });

    expect(res.statusCode).toEqual(200);
    expect(res.body.questionId).toBe(String(question.questionId));
    expect(res.body.questionTitle).toBe(question.questionTitle);
    expect(res.body.questionDescription).toBe(question.questionDescription);
    expect(res.body.questionCategory[0]).toBe(question.questionCategory);
    expect(res.body.questionComplexity).toBe(question.questionComplexity);
    expect(res.body.questionTags[0]).toBe(question.questionTags);
    expect(res.body._id).toBe(validateQns._id.toString());
  });

});

describe ('findRandomByComplexity function', () => {
  let question1;
  let question2;
  let question3;
  beforeAll( async () => {
    question1 = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Easy",
      questionTags: "A question tag."
    };
    question2 = {
      questionId: 2,
      questionTitle: "A question title2.",
      questionDescription: "A question description2.",
      questionCategory: "A question category2.",
      questionComplexity: "Easy",
      questionTags: "A question tag."
    };
    question3 = {
      questionId: 3,
      questionTitle: "A question title3.",
      questionDescription: "A question description3.",
      questionCategory: "A question category3.",
      questionComplexity: "Hard",
      questionTags: "A question tag."
    };
    await (new Question(question1)).save();
    await (new Question(question2)).save();
    await (new Question(question3)).save();
  });
  afterAll(async () => {
    await Question.deleteMany({});
  });

  it('should return zero questions', async () => {
    const res = await request(app)
      .get('/question/random/' + "Medium");

    expect(res.statusCode).toEqual(500);
  });

  it('should return question 3', async () => {
    const res = await request(app)
      .get('/question/random/' + "Hard");

      expect(res.statusCode).toEqual(200);
      expect(res.body.questionId).toBe(String(question3.questionId));
      expect(res.body.questionTitle).toBe(question3.questionTitle);
      expect(res.body.questionDescription).toBe(question3.questionDescription);
      expect(res.body.questionCategory[0]).toBe(question3.questionCategory);
      expect(res.body.questionComplexity).toBe(question3.questionComplexity);
      expect(res.body.questionTags[0]).toBe(question3.questionTags);
  });

  it('should return question 1 or 2', async () => {
    const res = await request(app)
      .get('/question/random/' + "Easy");

      expect(res.statusCode).toEqual(200);
      expect([String(question1.questionId), String(question2.questionId)]).toContain(res.body.questionId);
      expect([question1.questionTitle, question2.questionTitle]).toContain(res.body.questionTitle);
      expect([question1.questionDescription, question2.questionDescription]).toContain(res.body.questionDescription);
      expect([question1.questionCategory, question2.questionCategory]).toContain(res.body.questionCategory[0]);
      expect([question1.questionComplexity, question2.questionComplexity]).toContain(res.body.questionComplexity);
      expect([question1.questionTags, question2.questionTags]).toContain(res.body.questionTags[0]);
  });
});


describe ('update function', () => {
  let question;
  beforeAll(() => {
    question = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard",
      questionTags: "A question tag."
    };
  });

  afterEach(async () => {
    await Question.deleteMany({});
  });

  it('should update a question', async () => {
    const newQns = new Question(question);
    await newQns.save();

    const newQuestion = {
      questionId: 2,
      questionTitle: "A new question title2.",
      questionDescription: "A new question description2.",
      questionCategory: "A new question category2.",
      questionComplexity: "Hard",
      questionTags: "A question tag."
    };

    const res = await request(app)
      .put('/question/auth/' + question.questionId)
      .send(newQuestion);

    const validateQns = await Question.findOne({ questionId: newQuestion.questionId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Question updated successfully.");
    expect(validateQns.questionId.toString()).toBe(String(newQuestion.questionId));
    expect(validateQns.questionTitle.toString()).toBe(newQuestion.questionTitle);
    expect(validateQns.questionDescription.toString()).toBe(newQuestion.questionDescription);
    expect(validateQns.questionCategory.toString()).toBe(newQuestion.questionCategory);
    expect(validateQns.questionComplexity.toString()).toBe(newQuestion.questionComplexity);
    expect(validateQns.questionTags.toString()).toBe(newQuestion.questionTags);
    expect(validateQns._id.toString()).toBe(validateQns._id.toString());
  });

  it('should not update a question if questionId does not exist', async () => {
    const res = await request(app)
      .put('/question/auth/' + 1)
      .send(question);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Unable to update Question with questionId 1. Not found.");
  });
}); 

describe ('delete function', () => {
  let question;
  beforeAll(() => {
    question = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard"
    };
  });

  afterEach(async () => {
    await Question.deleteMany({});
  });

  it('should delete a question', async () => {
    const newQns = new Question(question);
    await newQns.save();

    const res = await request(app)
      .delete('/question/auth/' + question.questionId);

    const validateQns = await Question.findOne({ questionId: question.questionId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Question deleted successfully.");
    expect(validateQns).toBeNull();
  });
});

describe ('deleteAll function', () => {
  it('should delete all questions', async () => {
    let question1 = {
      questionId: 1,
      questionTitle: "A question title.",
      questionDescription: "A question description.",
      questionCategory: "A question category.",
      questionComplexity: "Hard"
    };
    let question2 = {
      questionId: 2,
      questionTitle: "A question title2.",
      questionDescription: "A question description2.",
      questionCategory: "A question category2.",
      questionComplexity: "Hard"
    };
    let question3 = {
      questionId: 3,
      questionTitle: "A question title3.",
      questionDescription: "A question description3.",
      questionCategory: "A question category3.",
      questionComplexity: "Hard"
    };

    await (new Question(question1)).save();
    await (new Question(question2)).save();
    await (new Question(question3)).save();

    const res = await request(app)
      .delete('/question/auth/');

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("3 Questions deleted successfully.");
  });
});