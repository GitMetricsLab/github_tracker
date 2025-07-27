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

module.exports = router;
