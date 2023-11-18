const request = require('supertest');
const app = require('./app.spec.js');

describe('enqueue function', () => {
  let match1;
  let match2;

  beforeAll(() => {
    match1 = {
      userid : "user1",
      difficuly : "Easy",
      language : "Python",
    };
    match2 = {
      userid : "user2",
      difficuly : "Easy",
      language : "Python",
    };
  });

  it('should enqueue a user', async () => {

    var res = request(app)
      .post('/matching/enqueue')
      .send(match1)
      .end((err) => {});

    //timeout to ensure the previous request is received by server
    await new Promise(resolve => setTimeout(resolve, 1000));

    res = await request(app)
      .get('/matching/getLength')
      .send();

    expect(res.body.length).toEqual(1);

    var res = await request(app)
      .post('/matching/dequeue')
      .send(match1);
  });


  it('should send a response with message and roomId if there is a match', async () => {
    var res1 = request(app)
      .post('/matching/enqueue')
      .send(match1)
      .end((err) => {});

    //timeout to ensure the previous request is received by server
    await new Promise(resolve => setTimeout(resolve, 1000));

    var res2 = await request(app)
      .post('/matching/enqueue')
      .send(match2);

    expect(res2.body.message).toBeDefined();
    expect(res2.body.roomId).toBeDefined();
    expect(res2.body.language).toEqual(match2.language);

    var res = await request(app)
      .get('/matching/getLength')
      .send();

    expect(res.body.length).toEqual(0);
  });
});

describe('dequeue function', () => {
  let match1;
  let match2;

  beforeEach(() => {
    match1 = {
      userid : "user1",
      difficuly : "Easy",
      language : "Python",
    };
    match2 = {
      userid : "user2",
      difficuly : "Easy",
      language : "Python",
    };
  });

  it('should dequeue a user', async () => {
    var res = request(app)
      .post('/matching/enqueue')
      .send(match1)
      .end((err) => {});

    //timeout to ensure the previous request is received by server
    await new Promise(resolve => setTimeout(resolve, 1000));

    res = await request(app)
      .post('/matching/dequeue')
      .send(match1);

    res = await request(app)
      .get('/matching/getLength')
      .send();

    expect(res.body.length).toEqual(0);
  });
});