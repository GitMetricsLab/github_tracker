const helmet = require('helmet');

const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'nonce-randomvalue'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https://api.github.com', 'https://avatars.githubusercontent.com'],
            connectSrc: ["'self'", 'https://api.github.com'],
            fontSrc: ["'self'", 'https://fonts.googleapis.com'],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

module.exports = securityHeaders;