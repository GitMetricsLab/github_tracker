const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

// Passport configuration
require('./config/passportConfig');

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

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

/**
 * Structured logger -- gates output behind NODE_ENV so that
 * logs are suppressed in tests (NODE_ENV=test).
 * In development and production, JSON logs are emitted.
 *
 * Each log entry is emitted as a JSON line for easy ingestion by
 * log-aggregation tools (Datadog, CloudWatch, ELK, etc.).
 */
const logger = {
        _write(level, message, meta = {}) {
                    // Suppress all logging in test environments
            if (process.env.NODE_ENV === 'test') return;

            const entry = {
                            timestamp: new Date().toISOString(),
                            level,
                            message,
                            ...meta,
            };

            if (level === 'error') {
                            // Errors go to stderr so they can be captured separately
                        process.stderr.write(JSON.stringify(entry) + '\n');
            } else {
                            // info / warn go to stdout
                        process.stdout.write(JSON.stringify(entry) + '\n');
            }
        },
        info(message, meta)  { this._write('info',  message, meta); },
        warn(message, meta)  { this._write('warn',  message, meta); },
        error(message, meta) { this._write('error', message, meta); },
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
        logger.info('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
                    logger.info('Server started', { port: process.env.PORT });
        });
}).catch((err) => {
        logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
});
