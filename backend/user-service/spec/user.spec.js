const request = require('supertest');
const db = require('../models');
const app = require('./app.spec.js');
var bcrypt = require('bcryptjs');

const User = db.user;
const Role = db.role;

describe('signup function', () => {
  let user;
  beforeEach(async () => {
    user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    };
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user with default role', async () => {
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User was registered successfully!');

    const savedUser = await User.findOne({ username: user.username });
    const userRole = await Role.findOne({ name: 'user' });
    //Verify User Fields
    expect(savedUser).toBeDefined();
    expect(savedUser.username).toBe(user.username);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.roles[0]._id).toEqual(userRole._id);
  });

  it('should create admin account', async () => {
    user.roles = ['admin'];
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User was registered successfully!');

    const savedUser = await User.findOne({ username: user.username });
    const userRole = await Role.findOne({ name: 'admin' });
    //Verify User Fields
    expect(savedUser).toBeDefined();
    expect(savedUser.username).toBe(user.username);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.roles[0]._id).toEqual(userRole._id);
  });

  it('should stop duplicate usernames', async () => {
    var res = await request(app)
      .post('/user/signup')
      .send(user);

    res = await request(app)
      .post('/user/signup')
      .send(user);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username is already in use!');
  });


  it('should stop duplicate emails', async () => {
      var res = await request(app)
        .post('/user/signup')
        .send(user);

      user.username = 'testuser2';

      res = await request(app)
        .post('/user/signup')
        .send(user);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is already in use!');
  });
});
describe("updateUser function", () => {
  let user;
  let agent;

  beforeAll(async () => {
    user = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    var res = await request(app)
      .post("/user/signup")
      .send(user);

    agent = request.agent(app, {withCredentials: true});

    res = await agent
      .post("/auth/signin")
      .send({ username: "testuser", password: "testpassword" });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should update the user's password", async () => {
    const res = await agent
      .post("/user/updateUser")
      .send({ newPassword: "newpassword" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password was updated successfully!");

    const updatedUser = await User.findOne({ username: user.username });
    expect(bcrypt.compareSync("newpassword", updatedUser.password)).toBe(true);
  });

});

describe("deleteUser function", () => {
  let user;
  let agent;

  beforeAll(async () => {
    user = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
    };

    var res = await request(app)
      .post("/user/signup")
      .send(user);

    agent = request.agent(app, {withCredentials: true});

    res = await agent
      .post("/auth/signin")
      .send({ username: "testuser", password: "testpassword" });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should delete the user", async () => {
    const res = await agent.post("/user/deleteUser");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User was deleted successfully!");

    const deletedUser = await User.findOne({ username: user.username });
    expect(deletedUser).toBeNull();
  });
});

describe("findAll function", () => {
  let adminAccount;
  let user1;
  let user2;
  let user3;
  let agent;

  beforeAll(async () => {
    adminAccount = {
      username: "admin",
      email: "admin@example.com",
      password: "adminpassword",
      roles: ["admin"]
    };

    var res = await request(app)
      .post("/user/signup")
      .send(adminAccount);

    agent = request.agent(app, {withCredentials: true})

    res = await agent
      .post("/auth/signin")
      .send({ username: "admin", password: "adminpassword" });

    user1 = {
      username: "user1",
      email: "user1@example.com",
      password: "user1password",
    };

    user2 = {
      username: "user2",
      email: "user2@example.com",
      password: "user2password",
    };

    user3 = {
      username: "user3",
      email: "user3@example.com",
      password: "user3password",
    };

    res = await request(app)
      .post("/user/signup")
      .send(user1);
    res = await request(app)
      .post("/user/signup")
      .send(user2);
    res = await request(app)
      .post("/user/signup")
      .send(user3);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return all users", async () => {
    const res = await agent.get("/user/allUsers");

    let usernames = [adminAccount.username, user1.username, user2.username, user3.username];
    let emails = [adminAccount.email, user1.email, user2.email, user3.email];

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);

    for (let i = 0; i < res.body.length; i++) {
      expect(usernames).toContain(res.body[i].username);
      expect(emails).toContain(res.body[i].email);
    }
  });

  it("should update if user is removed", async () => {
    User.findOneAndDelete({ username: user2.username }).exec();
    const res = await agent.get("/user/allUsers");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);

    for (let i = 0 ; i < res.body.length ; i++) {
      expect(res.body[i].username).not.toBe(user2.username);
      expect(res.body[i].email).not.toBe(user2.email);
    }
  });
});