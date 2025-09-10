// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// ===== Signup Route =====
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Login Route =====
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ msg: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ msg: 'Logged in successfully', user: { username: user.username } });
    });
  })(req, res, next);
});

// ===== Logout Route =====
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Logged out successfully' });
  });
});

// Export router as default
export default router;
