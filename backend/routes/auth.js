const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {

    const { username,  email, password } = req.body;

    try {
        const existingUser = await User.findOne( {email} );

        if (existingUser)
            return res.status(400).json( {message: 'User already exists'} );

        const newUser = new User( {username, email, password} );
        await newUser.save();
        res.status(201).json( {message: 'User created successfully'} );
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Login route
router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(200).json( { message: 'Login successful', user: req.user } );
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

// Get user tracker history
router.get("/tracker-history", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const user = await User.findById(req.user.id).select('trackerHistory');
        res.status(200).json({ trackerHistory: user?.trackerHistory || [] });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tracker history', error: err.message });
    }
});

// Save tracker search to history
router.post("/tracker-history", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const { username, searchedAt } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove duplicate if exists (keep only unique searches)
        user.trackerHistory = user.trackerHistory.filter(
            item => item.username.toLowerCase() !== username.toLowerCase()
        );
        
        // Add new search at the beginning
        user.trackerHistory.unshift({ username, searchedAt: new Date(searchedAt) });
        
        // Keep only last 10 searches
        user.trackerHistory = user.trackerHistory.slice(0, 10);
        user.lastTrackedAt = new Date();
        
        await user.save();
        res.status(200).json({ message: 'Tracker history saved', trackerHistory: user.trackerHistory });
    } catch (err) {
        res.status(500).json({ message: 'Error saving tracker history', error: err.message });
    }
});

module.exports = router;
