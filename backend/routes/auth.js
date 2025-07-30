const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error("Signup Error:", err.message);
        return res.status(500).json({
            message: 'Error creating user',
            error: err.message
        });
    }
});

// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Login Error:", err.message);
            return res.status(500).json({ message: 'Internal Server Error', error: err.message });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', error: info?.message || 'Authentication failed' });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Session Error:", err.message);
                return res.status(500).json({ message: 'Login failed', error: err.message });
            }

            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout Error:", err.message);
            return res.status(500).json({ message: 'Logout failed', error: err.message });
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
