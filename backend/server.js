const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const { validateEnv } = require('./config/validateEnv');
const logger = require('./logger');

// Fail fast in production when required env vars are absent.
try {
  validateEnv();
} catch (err) {
  logger.error(`[FATAL] ${err.message}`);
  process.exit(1);
}

// Passport configuration
require('./config/passportConfig');

const app = express();

// In development, fall back to localhost:5173 if FRONTEND_ORIGIN is not set so
// that contributors can run the stack without a full .env file.
const corsOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

if (!process.env.FRONTEND_ORIGIN) {
  logger.warn(
    'FRONTEND_ORIGIN is not set; defaulting to http://localhost:5173. ' +
    'Set this variable in production.'
  );
}

// CORS — explicit allowlist with credentials support.
// A function-based origin is required so that the header is only set (and
// reflected) for allowed origins; a static string would send the header on
// every response regardless of the requesting origin.
app.use(cors({
  origin: (requestOrigin, callback) => {
    // Allow same-origin requests (no Origin header) and the configured origin.
    if (!requestOrigin || requestOrigin === corsOrigin) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Only transmit the cookie over HTTPS in production.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
}));
app.use(passport.initialize());
app.use(passport.session());

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
