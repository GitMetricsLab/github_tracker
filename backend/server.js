const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Passport configuration
require('./config/passportConfig');

const app = express();

/* =========================
   Security Middleware
========================= */

// Helmet security headers
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter);

/* =========================
   CORS Configuration
========================= */

const rawAllowedOrigins =
    process.env.ALLOWED_ORIGINS ||
    process.env.CLIENT_URL ||
    'http://localhost:5173';

const allowedOrigins = rawAllowedOrigins
    .split(',')
    .map(origin => origin.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

/* =========================
   Body Parser
========================= */

app.use(bodyParser.json());

/* =========================
   Session Configuration
========================= */

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    console.warn('⚠ SESSION_SECRET is missing in .env');
}

app.use(session({
    secret: sessionSecret || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

/* =========================
   Passport Middleware
========================= */

app.use(passport.initialize());
app.use(passport.session());

/* =========================
   Routes
========================= */

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

/* =========================
   MongoDB Connection
========================= */

const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/githubTracker';

if (!process.env.MONGO_URI) {
    console.warn('⚠ MONGO_URI missing in .env');
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });