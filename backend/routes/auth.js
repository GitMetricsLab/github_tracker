const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { signupSchema, loginSchema } = require("../validators/authValidator");
const { validateRequest } = require("../validators/validationRequest");
const {
  getFrontendUrl,
  isOAuthProviderConfigured,
} = require("../config/passportConfig");
const router = express.Router();

function handleOAuthCallback(req, res, next) {
  const frontendUrl = getFrontendUrl();

  passport.authenticate(req.oauthProvider, (err, user, info) => {
    if (err) {
      const message = encodeURIComponent(err.message || "OAuth authentication failed");
      return res.redirect(`${frontendUrl}/login?oauth=error&message=${message}`);
    }

    if (!user) {
      const message = encodeURIComponent(info?.message || "OAuth authentication failed");
      return res.redirect(`${frontendUrl}/login?oauth=error&message=${message}`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        const message = encodeURIComponent(loginErr.message || "Failed to create session");
        return res.redirect(`${frontendUrl}/login?oauth=error&message=${message}`);
      }
      return res.redirect(`${frontendUrl}/login?oauth=success`);
    });
  })(req, res, next);
}

function guardOAuthProvider(provider) {
  return (req, res, next) => {
    if (!isOAuthProviderConfigured(provider)) {
      return res.status(503).json({
        message: `${provider} OAuth is not configured on the server`,
      });
    }
    next();
  };
}

// Signup route
router.post("/signup", validateRequest(signupSchema), async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password, provider: "local" });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// Login route
router.post("/login", validateRequest(loginSchema), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Login failed", error: err.message });
    }

    if (!user) {
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: "Login failed", error: loginErr.message });
      }
      return res.status(200).json({ message: "Login successful", user: req.user });
    });
  })(req, res, next);
});

// Current session
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.status(200).json({ user: req.user });
});

// Available OAuth providers
router.get("/oauth/providers", (_req, res) => {
  res.status(200).json({
    google: isOAuthProviderConfigured("google"),
    github: isOAuthProviderConfigured("github"),
  });
});

// Google OAuth2
router.get("/google", guardOAuthProvider("google"), passport.authenticate("google", {
  scope: ["profile", "email"],
  session: true,
}));

router.get("/google/callback", guardOAuthProvider("google"), (req, res, next) => {
  req.oauthProvider = "google";
  handleOAuthCallback(req, res, next);
});

// GitHub OAuth2
router.get("/github", guardOAuthProvider("github"), passport.authenticate("github", {
  scope: ["user:email"],
  session: true,
}));

router.get("/github/callback", guardOAuthProvider("github"), (req, res, next) => {
  req.oauthProvider = "github";
  handleOAuthCallback(req, res, next);
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
