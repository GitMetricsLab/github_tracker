const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const cors = require('cors');

// Passport configuration
require('./config/passportConfig');

const logger = require('./logger');

const app = express();

// CORS configuration
app.use(cors('*'));

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting — 10 attempts per 15-minute window per IP on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again after 15 minutes.' },
    skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    logger.info('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        logger.info(`Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    logger.error('MongoDB connection error', err);
});
