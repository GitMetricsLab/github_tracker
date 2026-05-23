const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne( {email} );
                if (!user) {
                    // Generic message prevents user enumeration
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, {
                    id : user._id.toString(),
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

// Deserialize user — exclude password hash from req.user on every request
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
