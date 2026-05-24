const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const cors = require('cors');

// Passport configuration
require('./config/passportConfig');

const logger = require('./logger');
const securityHeaders = require('./middleware/security');
const { validateEnv } = require('./middleware/envValidator');
const httpLogger = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { requireAuth } = require('./middleware/auth');

// Validate environment variables
validateEnv();

const app = express();

app.use(securityHeaders);
app.use(httpLogger);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600,
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 30,
        domain: process.env.COOKIE_DOMAIN || undefined,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again after 15 minutes.' },
    skipSuccessfulRequests: true,
    // keyGenerator: (req) => req.ip, // Rate limit by IP address
});

// General API: 100 requests per 15 minutes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.isAuthenticated(), // Skip rate limiting for authenticated users
})

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Health Check
app.get('/api/health', (req,res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    minPoolSize: 5,
    waitQueueTimeoutMS: 10000,
}).then(() => {
    logger.info('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        logger.info(`Server running on port ${process.env.PORT}`);
        logger.info(`✓ Environment: ${process.env.NODE_ENV}`);
    });
}).catch((err) => {
    logger.error('MongoDB connection error', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
    })
})
