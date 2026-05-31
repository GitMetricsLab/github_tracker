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

// CORS configuration - allow common local dev origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'https://github-spy.etlify.app'
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin like curl/postman
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy: ' + origin));
        }
    },
    credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax', // help ensure cross-port cookies work in dev
    },
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// Bookmarks
const bookmarkRoutes = require('./routes/bookmarks');
app.use('/api/bookmarks', bookmarkRoutes);

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
