const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

// Passport configuration
require('./config/passportConfig');

const logger = require('./logger');

const app = express();

// CORS configuration
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// When MongoDB is unavailable, auth routes use a file-backed session user.
if (!process.env.MONGO_URI) {
    app.use((req, res, next) => {
        if (req.session?.authUser) {
            req.user = req.session.authUser;
        }

        next();
    });
}

// Routes
const authRoutes = require('./routes/auth');
const discussionRoutes = require('./routes/discussions');
app.use('/api/auth', authRoutes);
app.use('/api/discussions', discussionRoutes);

const startServer = () => {
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
    });
};

// Connect to MongoDB when available, but do not block community discussions if it is not.
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {})
        .then(() => {
            logger.info('Connected to MongoDB');
            startServer();
        })
        .catch((err) => {
            logger.error('MongoDB connection error', err);
            logger.warn('Starting without MongoDB; auth routes may fail, but the discussion backend remains available');
            startServer();
        });
} else {
    logger.warn('MONGO_URI is not set; starting without MongoDB');
    startServer();
}
