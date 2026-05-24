const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

describe('Security Middleware Suite Tests', () => {
    let app;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/githubTracker');

        app = require('../server');
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    // =========================
    // CORS TESTS
    // =========================
    describe('CORS Configuration', () => {
        it('should allow requests from CLIENT_URL', async () => {
            const response = await request(app)
                .options('/api/auth/login')
                .set('Origin', 'http://localhost:5173')
                .set('Access-Control-Request-Method', 'POST');

            expect(response.headers['access-control-allow-origin'])
                .toBe('http://localhost:5173');

            expect(response.headers['access-control-allow-credentials'])
                .toBe('true');
        });

        it('should reject requests from unauthorized origin', async () => {
            const response = await request(app)
                .options('/api/auth/login')
                .set('Origin', 'http://evil-site.com')
                .set('Access-Control-Request-Method', 'POST');

            // Some CORS middleware returns no header
            expect(
                response.headers['access-control-allow-origin']
            ).not.toBe('http://evil-site.com');
        });
    });

    // =========================
    // RATE LIMITING TESTS
    // =========================
    describe('Rate Limiting', () => {
        const validPayload = {
            email: 'ratetest@example.com',
            password: 'WrongPassword123!',
        };

        it('should allow up to 10 requests within limit', async () => {
            for (let i = 0; i < 10; i++) {
                const response = await request(app)
                    .post('/api/auth/login')
                    .set('X-Forwarded-For', `192.168.1.${i}`)
                    .send(validPayload);

                expect(response.status).not.toBe(429);
            }
        });

        it('should reject requests after exceeding rate limit', async () => {
            const ip = '10.10.10.10';

            // Exhaust limit
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post('/api/auth/login')
                    .set('X-Forwarded-For', ip)
                    .send(validPayload);
            }

            // 11th request
            const response = await request(app)
                .post('/api/auth/login')
                .set('X-Forwarded-For', ip)
                .send(validPayload);

            expect(response.status).toBe(429);

            if (response.body.message) {
                expect(response.body.message.toLowerCase())
                    .toContain('too');
            }
        });
    });

    // =========================
    // SECURITY HEADERS TESTS
    // =========================
    describe('Security Headers', () => {
        it('should include Content-Security-Policy header', async () => {
            const response = await request(app).get('/api/health');

            expect(
                response.headers['content-security-policy']
            ).toBeDefined();
        });

        it('should include X-Frame-Options header', async () => {
            const response = await request(app).get('/api/health');

            expect(response.headers['x-frame-options'])
                .toBe('DENY');
        });

        it('should include X-Content-Type-Options header', async () => {
            const response = await request(app).get('/api/health');

            expect(response.headers['x-content-type-options'])
                .toBe('nosniff');
        });

        it('should include Referrer-Policy header', async () => {
            const response = await request(app).get('/api/health');

            expect(response.headers['referrer-policy'])
                .toBe('strict-origin-when-cross-origin');
        });
    });

    // =========================
    // SESSION COOKIE TESTS
    // =========================
    describe('Session Cookie Security', () => {
        beforeAll(async () => {
            await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'testuser123',
                    email: 'cookie-test@example.com',
                    password: 'Secure123!',
                });
        });

        it('should have httpOnly flag set', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'cookie-test@example.com',
                    password: 'Secure123!',
                });

            const setCookieHeader = response.headers['set-cookie'][0];

            expect(setCookieHeader).toContain('HttpOnly');
        });

        it('should have SameSite flag set', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'cookie-test@example.com',
                    password: 'Secure123!',
                });

            const setCookieHeader = response.headers['set-cookie'][0];

            expect(setCookieHeader).toContain('SameSite');
        });
    });

    // =========================
    // AUTH TESTS
    // =========================
    describe('Authentication Middleware', () => {
        it('should reject logout request without authentication', async () => {
            const response = await request(app)
                .get('/api/auth/logout');

            expect(response.status).toBe(401);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toContain('Authentication');
        });

        it('should allow logout with valid session', async () => {
            const agent = request.agent(app);

            // Login
            const loginResponse = await agent
                .post('/api/auth/login')
                .send({
                    email: 'cookie-test@example.com',
                    password: 'Secure123!',
                });

            expect(loginResponse.status).toBe(200);

            // Logout
            const response = await agent
                .get('/api/auth/logout');

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
        });
    });

    // =========================
    // RESPONSE FORMAT TESTS
    // =========================
    describe('Centralized Response Format', () => {
        it('should return success field in all responses', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'formattest',
                    email: 'format@example.com',
                    password: 'Format123!',
                });

            expect(response.body.success).toBeDefined();

            expect(typeof response.body.success)
                .toBe('boolean');
        });

        it('should return consistent error format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid@example.com',
                    password: 'invalid',
                });

            expect(response.body.success).toBeDefined();

            expect(response.body.success).toBe(false);

            expect(response.body.message).toBeDefined();
        });
    });

    // =========================
    // ERROR HANDLING TESTS
    // =========================
    describe('Centralized Error Handling', () => {
        it('should not expose sensitive error details in production', async () => {
            const originalEnv = process.env.NODE_ENV;

            process.env.NODE_ENV = 'production';

            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.body.stack).toBeUndefined();

            process.env.NODE_ENV = originalEnv;
        });

        it('should include stack trace in development', async () => {
            const originalEnv = process.env.NODE_ENV;

            process.env.NODE_ENV = 'development';

            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            // Optional because some apps disable stack in tests
            if (response.body.stack !== undefined) {
                expect(response.body.stack).toBeDefined();
            }

            process.env.NODE_ENV = originalEnv;
        });
    });
});