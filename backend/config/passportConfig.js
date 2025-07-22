const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const GitHubStrategy = require('passport-github2').Strategy;


passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await User.findOne( {email} );
                if (!user) {
                    return done(null, false, { message: 'Email is invalid '});
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid password' });
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

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

// Serialize user (store user info in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
