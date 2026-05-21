const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validateRequest } = require("../validators/validationRequest");
const router = express.Router();

// Signup route
router.post("/signup", validateRequest(signupSchema), async (req, res) => {

    const { username,  email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }

        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route — session is regenerated after successful authentication
// to prevent session fixation; only safe fields returned in the response
router.post("/login", validateRequest(loginSchema), (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || 'Invalid credentials' });

        req.session.regenerate((regenerateErr) => {
            if (regenerateErr) return next(regenerateErr);

            req.logIn(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                res.status(200).json({
                    message: 'Login successful',
                    user: { id: user.id, username: user.username, email: user.email },
                });
            });
        });
    })(req, res, next);
});

// Logout route
router.get("/logout", (req, res) => {

    req.logout((err) => {

        if (err)
            return res.status(500).json({ message: 'Logout failed' });
        else
            res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
