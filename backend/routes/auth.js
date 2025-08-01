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

// GitHub OAuth callback route
router.post("/github/callback", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
    }

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/github/callback`
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).json({ message: 'Failed to get access token from GitHub' });
        }

        const accessToken = tokenData.access_token;

        // Get user information from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).json({ message: 'Failed to get user data from GitHub' });
        }

        // Get user emails from GitHub
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const emailsData = await emailsResponse.json();
        const primaryEmail = emailsData.find(email => email.primary)?.email || userData.email;

        // Check if user exists, if not create one
        let user = await User.findOne({ email: primaryEmail });

        if (!user) {
            // Create new user with GitHub data
            user = new User({
                username: userData.login,
                email: primaryEmail,
                githubId: userData.id,
                githubUsername: userData.login,
                avatarUrl: userData.avatar_url,
                // Set a random password since GitHub users don't have passwords
                password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
            });
            await user.save();
        } else {
            // Update existing user with GitHub info
            user.githubId = userData.id;
            user.githubUsername = userData.login;
            user.avatarUrl = userData.avatar_url;
            await user.save();
        }

        // Log the user in
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login failed', error: err.message });
            }
            res.status(200).json({ 
                message: 'GitHub authentication successful', 
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    githubUsername: user.githubUsername,
                    avatarUrl: user.avatarUrl
                }
            });
        });

    } catch (error) {
        console.error('GitHub OAuth error:', error);
        res.status(500).json({ message: 'GitHub authentication failed', error: error.message });
    }
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
