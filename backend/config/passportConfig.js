const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select("+password");
                if (!user) {
                    return done(null, false, { message: 'Email is invalid ' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid password' });
                }

                return done(null, {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Serialize user (store user info in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        
        // 🛡️ Safety check: If the user record no longer exists in MongoDB, exit safely
        // This prevents the application from throwing an unhandled TypeError downstream
        if (!user) {
            return done(null, false); // Gracefully invalidates the cookie and ends the request loop
        }
        
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
