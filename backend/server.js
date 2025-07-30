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

// ✅ CORS configuration (recommended)
app.use(cors({
    origin: '*', // You can replace * with specific domains in production
    credentials: true,
}));

// ✅ Middleware
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Fallback route for 404 Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// ✅ Global error-handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // exit the process on DB failure
    });
