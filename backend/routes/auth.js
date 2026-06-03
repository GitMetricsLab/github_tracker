const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validateRequest } = require("../validators/validationRequest");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth } = require("../middleware/auth");
const { success, email } = require("zod");
const router = express.Router();

// Signup route
router.post("/signup", validateRequest(signupSchema), asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser)
        return res.status(400).json({
        success: false,
        message: 'User already exists' 
    });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({
        success: true,
        message: 'User created successfully' });
}));

// Login route
router.post("/login", validateRequest(loginSchema), (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });

        req.session.regenerate((regenerateErr) => {
            if (regenerateErr) return next(regenerateErr);

            req.logIn(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    user: { id: user.id, username: user.username, email: user.email }
                });
            });
        });
    })(req, res, next);
});

// Logout route with authentication check
router.get("/logout", requireAuth, asyncHandler(async (req, res) => {

    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    });
}));

// Get current user route with authentication check
router.get("/me", requireAuth, asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        },
    });
}));

module.exports = router;
