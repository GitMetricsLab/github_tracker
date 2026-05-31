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
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //Cross-domain cookies = 'none'
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    logger.info('Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    logger.error('MongoDB connection error', err);
});
