const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const session = require('express-session');
const passport = require('passport');

const User = require('../backend/models/User');
const authRoutes = require('../backend/routes/auth');

// Create test app
function createTestApp() {
  const app = express();

  app.use(express.json());

  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Load passport config AFTER initializing passport
  require('../backend/config/passportConfig');

  app.use('/auth', authRoutes);

  return app;
}

describe('Auth Routes', () => {
  let app;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/github_tracker_test');
    app = createTestApp();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // ---------------- SIGNUP ----------------
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
  });

  it('should not sign up a user with existing email', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password456',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  // ---------------- LOGIN ----------------
  it('should login a user with correct credentials', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const agent = request.agent(app);

    const res = await agent.post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not login a user with wrong password', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const agent = request.agent(app);

    const res = await agent.post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });

  it('should list configured OAuth providers', async () => {
    const res = await request(app).get('/auth/oauth/providers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(jasmine.objectContaining({
      google: jasmine.any(Boolean),
      github: jasmine.any(Boolean),
    }));
  });

  // ---------------- LOGOUT ----------------
  it('should logout a logged-in user', async () => {
    const agent = request.agent(app);

    await agent.post('/auth/signup').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    await agent.post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await agent.get('/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });
});