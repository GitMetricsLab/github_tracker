const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const isGitHubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL);

// Signup route
router.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Login route
router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
});

// GitHub OAuth start route
router.get('/github', (req, res, next) => {
    if (!isGitHubConfigured) {
        return res.status(503).json({ message: 'GitHub OAuth is not configured' });
    }

    return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

// GitHub OAuth callback route
router.get('/github/callback', (req, res, next) => {
    if (!isGitHubConfigured) {
        return res.redirect(`${frontendUrl}/login?githubAuth=not_configured`);
    }

    return passport.authenticate('github', {
        failureRedirect: `${frontendUrl}/login?githubAuth=failed`,
    })(req, res, next);
}, (_req, res) => {
    res.redirect(`${frontendUrl}/login?githubAuth=success`);
});

router.get("/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            authenticated: false,
        });
    }

    return res.status(200).json({
        authenticated: true,
        user: req.user,
    });
});

// Logout route
router.get("/logout", (req, res) => {

    req.logout((err) => {

        if (err)
            return res.status(500).json({ message: 'Logout failed', error: err.message });
        else
            res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
