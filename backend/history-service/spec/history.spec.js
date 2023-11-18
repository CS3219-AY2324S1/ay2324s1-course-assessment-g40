const request = require('supertest');
const app = require('./app.spec.js');
const db = require("../models");
const { findAll } = require('../controllers/history.controller.js');

const History = db.histories;  

describe('findOne function', () => {
  let entry;
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should return a history entry', async () => {
    const res = await request(app).get('/history/attempt/1/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].questionId).toEqual(entry.questionId);
    expect(res.body[0].language).toEqual(entry.language);
    expect(res.body[0].solution).toEqual(entry.solution);
    expect(res.body[0].userId).toEqual(entry.userId);
    expect(res.body[0].userId2).toEqual(entry.userId2);
  });

  it('should return empty if no entry is found', async () => {
    const res = await request(app).get('/history/attempt/2/2');
    expect(res.body).toHaveSize(0);
  });

});

describe('create function', () => {
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should create a history entry', async () => {
    const res = await request(app).post('/history/1/1').send({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      user_id2: 2
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.questionId).toEqual('1');
    expect(res.body.language).toEqual('javascript');
    expect(res.body.solution).toEqual('console.log("Hello World!")');
    expect(res.body.userId).toEqual('1');
    expect(res.body.userId2).toEqual('2');

    History.findOne({questionId: 1, userId: 1}).then(data => {
      expect(data.questionId).toEqual('1');
      expect(data.language).toEqual('javascript');
      expect(data.solution).toEqual('console.log("Hello World!")');
      expect(data.userId).toEqual('1');
      expect(data.userId2).toEqual('2');
    });

  });

  it('should return 400 if no body is sent', async () => {
    const res = await request(app).post('/history/1/1');
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('History missing.');
  });
});

describe('update function', () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should update a history entry', async () => {
    const res = await request(app).put('/history/1/1').send({
      questionId: 1, 
      language: 'python', 
      solution: 'console.log("Goodbye World!")', 
      userId: 1, 
      user_id2: 2
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('History updated successfully.');

    await History.findOne({questionId: 1, userId: 1}).then(data => {
      expect(data.questionId).toEqual('1');
      expect(data.language).toEqual('python');
      expect(data.solution).toEqual('console.log("Goodbye World!")');
      expect(data.userId).toEqual('1');
      expect(data.userId2).toEqual('2');

    });
  });

  it('should return 404 if questionid not found', async () => {
    const res = await request(app).put('/history/2/1').send({
      questionId: 2, 
      language: 'python', 
      solution: 'console.log("Goodbye World!")', 
      userId: 1, 
      user_id2: 2
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Unable to update History with questionId 2. Not found.');

  });

  it('should return 400 if no body is sent', async () => {
    const res = await request(app).post('/history/1/1');
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('History missing.');
  });
});

describe('delete function', () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should delete a history entry', async () => {
    const res = await request(app).delete('/history/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('History for question 1 deleted successfully.');
    History.findOne({questionId: 1}).then(data => {
      expect(data).toEqual(null);
    });
  });
});

describe("findAll function", () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
    entry = new History({
      questionId: 2, 
      language: 'python', 
      solution: 'console.log("Test Log!")', 
      userId: 2, 
      userId2: 4
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should return all history entries', async () => {
    const res = await request(app).get('/history/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveSize(2);
  });
});

describe("findUserHistory function", () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
    entry = new History({
      questionId: 2, 
      language: 'python', 
      solution: 'console.log("Test Log!")', 
      userId: 2, 
      userId2: 4
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should return only history entries for user 2', async () => {
    const res = await request(app).get('/history/user/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveSize(1);
    expect(res.body[0].questionId).toEqual('1');
    expect(res.body[0].language).toEqual('javascript');
    expect(res.body[0].solution).toEqual('console.log("Hello World!")');
    expect(res.body[0].userId).toEqual('1');
    expect(res.body[0].userId2).toEqual('2');
  });
  it('should return only history entries for user 2', async () => {
    const res = await request(app).get('/history/user/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveSize(1);
    expect(res.body[0].questionId).toEqual('2');
    expect(res.body[0].language).toEqual('python');
    expect(res.body[0].solution).toEqual('console.log("Test Log!")');
    expect(res.body[0].userId).toEqual('2');
    expect(res.body[0].userId2).toEqual('4');
  });
});


describe("findQuestionHistory function", () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
    entry = new History({
      questionId: 2, 
      language: 'python', 
      solution: 'console.log("Test Log!")', 
      userId: 2, 
      userId2: 4
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should return only history entries for question 1', async () => {
    const res = await request(app).get('/history/question/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveSize(1);
    expect(res.body[0].questionId).toEqual('1');
    expect(res.body[0].language).toEqual('javascript');
    expect(res.body[0].solution).toEqual('console.log("Hello World!")');
    expect(res.body[0].userId).toEqual('1');
    expect(res.body[0].userId2).toEqual('2');
  });

  it('should return only history entries for question 2', async () => {
    const res = await request(app).get('/history/question/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveSize(1);
    expect(res.body[0].questionId).toEqual('2');
    expect(res.body[0].language).toEqual('python');
    expect(res.body[0].solution).toEqual('console.log("Test Log!")');
    expect(res.body[0].userId).toEqual('2');
    expect(res.body[0].userId2).toEqual('4');
  });
}); 

describe("deleteAll function", () => {
  beforeAll(() => {
    entry = new History({
      questionId: 1, 
      language: 'javascript', 
      solution: 'console.log("Hello World!")', 
      userId: 1, 
      userId2: 2
    });
    History.create(entry);
    entry = new History({
      questionId: 2, 
      language: 'python', 
      solution: 'console.log("Test Log!")', 
      userId: 2, 
      userId2: 4
    });
    History.create(entry);
    entry = new History({
      questionId: 3, 
      language: 'javascript', 
      solution: 'console.log("Man oh man!")', 
      userId: 1, 
      userId2: 3
    });
    History.create(entry);
  });
  afterAll(async () => {
    await History.deleteMany({});
  });

  it('should delete all history entries', async () => {
    const res = await request(app).delete('/history/');

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('3 histories deleted successfully.');

    History.find().then(data => {
      expect(data).toHaveSize(0);
    });
  });
});