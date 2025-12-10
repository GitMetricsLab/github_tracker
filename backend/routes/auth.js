const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

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
router.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, { expiresIn: "1d" });
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
}
);

// Logout route
router.get("/logout", (req, res) => {

    req.logout((err) => {

        if (err)
            return res.status(500).json({ message: 'Logout failed', error: err.message });
        else
            res.status(200).json({ message: 'Logged out successfully' });
    });
});

// ---------------- AUTH MIDDLEWARE ----------------
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// ---------------- GET PROFILE ----------------
router.get("/profile", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
});

// ---------------- EDIT PROFILE ----------------
router.put("/profile", requireAuth, async (req, res) => {
    try {
        const updates = {};
        const { username, email, bio, avatar, newPassword } = req.body;

        if (username !== undefined) updates.username = username;
        if (email !== undefined) updates.email = email;
        if (bio !== undefined) updates.bio = bio;
        if (avatar !== undefined) updates.avatar = avatar;

        // Handle password update if newPassword is provided
        if (newPassword !== undefined && newPassword.trim().length > 0) {
            // Password will be hashed by the User model's pre-save hook
            updates.password = newPassword;
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, {
            new: true,
            runValidators: true,
            select: "-password",
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
});
module.exports = router;
