const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const { createSessionConfig } = require('./config/session');

// Passport configuration
require('./config/passportConfig');

const logger = require('./logger');

const app = express();

// Enable trust proxy
app.set('trust proxy', 1); 

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'https://github-spy.netlify.app']; // there was a typo error in the url, it is fixed now.
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else{
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true
}));

// Middleware
app.use(bodyParser.json());
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

global.mongooseConnected = false;

app.use((req, res, next) => {
    if (!global.mongooseConnected) {
        if (req.session?.authUser) {
            req.user = req.session.authUser;
        }
    }

    next();
});

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
            global.mongooseConnected = true;
            startServer();
        })
        .catch((err) => {
            logger.error('MongoDB connection error', err);
            logger.warn('Starting without MongoDB; falling back to JSON file-backed authentication');
            global.mongooseConnected = false;
            startServer();
        });
} else {
    logger.warn('MONGO_URI is not set; starting without MongoDB');
    global.mongooseConnected = false;
    startServer();
}
