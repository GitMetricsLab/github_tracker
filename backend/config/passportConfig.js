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
                    return done(null, false, { message: 'Invalid email or password' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid email or password' });
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

// Deserialize user (retrieve user from session)
// .select('-password -__v') excludes the bcrypt hash from req.user so it
// cannot be accidentally serialized into an API response.
// .lean() returns a plain object instead of a Mongoose document, preventing
// model methods from being accessible on req.user.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password -__v').lean();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
