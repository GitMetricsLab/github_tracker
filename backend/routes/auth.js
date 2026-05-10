const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/authMiddleware"); // I'm calling the Middleware I just created here
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

// I'm writing a much more complex login route here because I want to handle all the possible errors that can happen during the login process, and I also want to return the user data if the login is successful. This way, the frontend can easily access the user information after logging in without needing to make an additional request to get the current user.
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Login error", error: err.message });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Session error", error: err.message });
      }
      res.status(200).json({ message: "Login successful", user: req.user });
    });
  })(req, res, next);
});

// Get current authenticated user
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    else res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
