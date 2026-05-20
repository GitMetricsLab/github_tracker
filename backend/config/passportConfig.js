const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");

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

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists by their email
                let user = await User.findOne({ email: profile.emails[0].value });
                
                if (!user) {
                    // Create a user placeholder if they are logging in for the first time
                    user = new User({
                        username: profile.displayName.replace(/\s+/g, "_").toLowerCase() + "_" + profile.id.substring(0, 5),
                        email: profile.emails[0].value,
                        // Create a dummy password since the schema requires it
                        password: "OAUTH_USER_EXTERNAL_PROVIDER" 
                    });
                    await user.save();
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

// 2. GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/auth/github/callback",
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // If GitHub doesn't return a public email, fall back to a dummy identifier string
                const userEmail = profile.emails?.[0]?.value || `${profile.username}@github.oauth`;
                let user = await User.findOne({ email: userEmail });

                if (!user) {
                    user = new User({
                        username: profile.username,
                        email: userEmail,
                        password: "OAUTH_USER_EXTERNAL_PROVIDER"
                    });
                    await user.save();
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
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
