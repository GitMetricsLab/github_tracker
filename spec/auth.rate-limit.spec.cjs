const express = require('express');
const request = require('supertest');

const {
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW_MS,
  createAuthRateLimiter,
} = require('../backend/config/authRateLimit');

function createRateLimitedAuthApp(max = 2) {
  const app = express();

  app.use(express.json());
  app.post('/api/auth/login', createAuthRateLimiter({ max }), (req, res) => {
    res.status(200).json({ message: 'Login successful' });
  });
  app.post('/api/auth/signup', createAuthRateLimiter({ max }), (req, res) => {
    res.status(201).json({ message: 'User created successfully' });
  });

  return app;
}

describe('Auth rate limiting', () => {
  it('uses the configured production auth limiter baseline', () => {
    expect(AUTH_RATE_LIMIT_MAX).toBe(10);
    expect(AUTH_RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000);
  });

  it('allows legitimate login requests under the threshold', async () => {
    const app = createRateLimitedAuthApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('blocks excessive login requests with HTTP 429', async () => {
    const app = createRateLimitedAuthApp();

    await request(app).post('/api/auth/login').send({});
    await request(app).post('/api/auth/login').send({});
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(429);
  });

  it('blocks excessive signup requests with HTTP 429', async () => {
    const app = createRateLimitedAuthApp();

    await request(app).post('/api/auth/signup').send({});
    await request(app).post('/api/auth/signup').send({});
    const res = await request(app).post('/api/auth/signup').send({});

    expect(res.status).toBe(429);
  });

  it('returns standard rate-limit headers without legacy headers', async () => {
    const app = createRateLimitedAuthApp();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.headers['ratelimit-limit']).toBeDefined();
    expect(res.headers['ratelimit-remaining']).toBeDefined();
    expect(res.headers['ratelimit-reset']).toBeDefined();
    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
  });
});
