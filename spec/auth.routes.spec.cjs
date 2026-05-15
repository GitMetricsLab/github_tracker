const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const session = require('express-session');
const passport = require('passport');
const User = require('../backend/models/User');
const authRoutes = require('../backend/routes/auth');

// Setup Express app for testing
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  require('../backend/config/passportConfig');
  app.use('/auth', authRoutes);
  return app;
}

describe('Auth Routes', () => {
  let app;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/github_tracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app = createTestApp();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
  });

  it('should not sign up a user with existing email', async () => {
    await new User({ username: 'testuser', email: 'test@example.com', password: 'password123' }).save();
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser2', email: 'test@example.com', password: 'password456' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should login a user with correct credentials', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    const agent = request.agent(app);
    const res = await agent
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not login a user with wrong password', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    const agent = request.agent(app);
    const res = await agent
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('should logout a logged-in user', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    const agent = request.agent(app);
    await agent
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    const res = await agent.get('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });
}); 