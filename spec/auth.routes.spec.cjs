const express = require('express');
const request = require('supertest');
const cors = require('cors');

// All backend modules are resolved from the backend directory so the test app
// and the application code share a single instance of each module — avoids
// connection-state mismatches that arise when backend/node_modules is present
// alongside the root node_modules.
const backendPath = [`${__dirname}/../backend`];

const mongoose = require(require.resolve('mongoose', { paths: backendPath }));
const session  = require(require.resolve('express-session', { paths: backendPath }));
const passport = require(require.resolve('passport', { paths: backendPath }));

const User       = require('../backend/models/User');
const authRoutes = require('../backend/routes/auth');
const { validateEnv } = require('../backend/config/validateEnv');

// A fixed allowed origin used throughout the test suite.
const ALLOWED_ORIGIN = 'http://localhost:5173';

// Password satisfying the signup Zod schema (uppercase + lowercase + digit + special).
const VALID_PASSWORD = 'TestPass1!';

function createTestApp() {
  const app = express();

  // Mirror the production CORS config: function-based origin so the header is
  // only reflected for the configured origin, absent for all others.
  const allowedOrigin = process.env.FRONTEND_ORIGIN || ALLOWED_ORIGIN;
  app.use(cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin || requestOrigin === allowedOrigin) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));

  app.use(express.json());

  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
      // Mirror production cookie options; secure:false is correct for HTTP tests.
      cookie: { httpOnly: true, secure: false, sameSite: 'strict' },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Load passport config AFTER initializing passport.
  require('../backend/config/passportConfig');

  app.use('/auth', authRoutes);

  return app;
}

// ---------------------------------------------------------------------------
// Integration tests that require a running MongoDB instance.
// All MongoDB-dependent suites live inside one outer describe so they share
// a single connection, unaffected by Jasmine's random suite ordering.
// ---------------------------------------------------------------------------
describe('Backend auth integration', () => {
  let app;

  beforeAll(async () => {
    process.env.FRONTEND_ORIGIN = ALLOWED_ORIGIN;
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
  describe('Auth Routes', () => {
    it('should sign up a new user', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: VALID_PASSWORD,
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
    });

    it('should not sign up a user with an existing email', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      const res = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: VALID_PASSWORD,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    // ---------------- LOGIN ----------------
    it('should login a user with correct credentials', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      const agent = request.agent(app);

      const res = await agent.post('/auth/login').send({
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should reject login with the wrong password', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      const agent = request.agent(app);

      const res = await agent.post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });

    // ---------------- LOGOUT ----------------
    it('should logout a logged-in user', async () => {
      const agent = request.agent(app);

      await agent.post('/auth/signup').send({
        username: 'testuser',
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      await agent.post('/auth/login').send({
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });

      const res = await agent.get('/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  // ---------------- CORS BEHAVIOUR ----------------
  describe('CORS behaviour', () => {
    it('should include Access-Control-Allow-Origin for the configured origin', async () => {
      const res = await request(app)
        .get('/auth/logout')
        .set('Origin', ALLOWED_ORIGIN);

      expect(res.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN);
    });

    it('should include Access-Control-Allow-Credentials: true for the allowed origin', async () => {
      const res = await request(app)
        .get('/auth/logout')
        .set('Origin', ALLOWED_ORIGIN);

      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should not set Access-Control-Allow-Origin for an unlisted origin', async () => {
      const res = await request(app)
        .get('/auth/logout')
        .set('Origin', 'http://evil.example.com');

      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('should respond to a preflight OPTIONS request from the allowed origin', async () => {
      const res = await request(app)
        .options('/auth/login')
        .set('Origin', ALLOWED_ORIGIN)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(res.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      // 204 is the standard success status for preflight responses.
      expect([200, 204]).toContain(res.status);
    });

    it('should include CORS headers on a credentialed login request from the allowed origin', async () => {
      await User.create({
        username: 'corsuser',
        email: 'cors@example.com',
        password: VALID_PASSWORD,
      });

      const res = await request(app)
        .post('/auth/login')
        .set('Origin', ALLOWED_ORIGIN)
        .send({ email: 'cors@example.com', password: VALID_PASSWORD });

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  // ---------------- SESSION COOKIE FLAGS ----------------
  describe('Session cookie security flags', () => {
    it('should set HttpOnly on the session cookie after login', async () => {
      await User.create({
        username: 'cookieuser',
        email: 'cookie@example.com',
        password: VALID_PASSWORD,
      });

      const res = await request(app)
        .post('/auth/login')
        .set('Origin', ALLOWED_ORIGIN)
        .send({ email: 'cookie@example.com', password: VALID_PASSWORD });

      expect(res.status).toBe(200);

      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeTruthy();

      const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
      expect(cookieStr).toMatch(/HttpOnly/i);
    });

    it('should set SameSite=Strict on the session cookie after login', async () => {
      await User.create({
        username: 'samesiteuser',
        email: 'samesite@example.com',
        password: VALID_PASSWORD,
      });

      const res = await request(app)
        .post('/auth/login')
        .set('Origin', ALLOWED_ORIGIN)
        .send({ email: 'samesite@example.com', password: VALID_PASSWORD });

      expect(res.status).toBe(200);

      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeTruthy();

      const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
      expect(cookieStr).toMatch(/SameSite=Strict/i);
    });
  });
});

// ---------------------------------------------------------------------------
// Environment validation — pure unit tests, no MongoDB required.
// ---------------------------------------------------------------------------
describe('Environment validation (validateEnv)', () => {
  let savedNodeEnv;
  let savedFrontendOrigin;
  let hadFrontendOrigin;

  beforeEach(() => {
    savedNodeEnv = process.env.NODE_ENV;
    hadFrontendOrigin = Object.prototype.hasOwnProperty.call(process.env, 'FRONTEND_ORIGIN');
    savedFrontendOrigin = process.env.FRONTEND_ORIGIN;
  });

  afterEach(() => {
    process.env.NODE_ENV = savedNodeEnv;
    if (hadFrontendOrigin) {
      process.env.FRONTEND_ORIGIN = savedFrontendOrigin;
    } else {
      delete process.env.FRONTEND_ORIGIN;
    }
  });

  it('should throw when FRONTEND_ORIGIN is absent in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.FRONTEND_ORIGIN;

    expect(() => validateEnv()).toThrow();
  });

  it('should include FRONTEND_ORIGIN in the error message when throwing in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.FRONTEND_ORIGIN;

    expect(() => validateEnv()).toThrowError(/FRONTEND_ORIGIN/);
  });

  it('should not throw when FRONTEND_ORIGIN is set in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_ORIGIN = 'https://app.example.com';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should not throw in development without FRONTEND_ORIGIN', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.FRONTEND_ORIGIN;

    expect(() => validateEnv()).not.toThrow();
  });

  it('should not throw in test environment without FRONTEND_ORIGIN', () => {
    process.env.NODE_ENV = 'test';
    delete process.env.FRONTEND_ORIGIN;

    expect(() => validateEnv()).not.toThrow();
  });
});
