import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username' });

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password'); // Exclude password
    done(null, user);
  } catch (err) {
    done(err);
  }
});
