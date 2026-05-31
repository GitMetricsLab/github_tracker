const rateLimit = require('express-rate-limit');

const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX = 10;

function createAuthRateLimiter(options = {}) {
    return rateLimit({
        windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
        max: AUTH_RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        ...options,
    });
}

const loginLimiter = createAuthRateLimiter();
const signupLimiter = createAuthRateLimiter();

module.exports = {
    AUTH_RATE_LIMIT_MAX,
    AUTH_RATE_LIMIT_WINDOW_MS,
    createAuthRateLimiter,
    loginLimiter,
    signupLimiter,
};
