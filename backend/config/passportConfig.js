const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const {
  findOrCreateOAuthUser,
  toSessionUser,
  isOAuthProviderConfigured,
} = require("../utils/oauthUser");

function getBackendUrl() {
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Email is invalid " });
        }

        if (user.provider !== "local" || !user.password) {
          return done(null, false, {
            message: `Please sign in with ${user.provider}`,
          });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, toSessionUser(user));
      } catch (err) {
        return done(err);
      }
    }
  )
);

if (isOAuthProviderConfigured("google")) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || `${getBackendUrl()}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const sessionUser = await findOrCreateOAuthUser({
            provider: "google",
            providerId: profile.id,
            email,
            displayName: profile.displayName,
            username: profile.displayName,
          });
          return done(null, sessionUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

if (isOAuthProviderConfigured("github")) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL || `${getBackendUrl()}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.find((entry) => entry.primary)?.value
            || profile.emails?.[0]?.value;

          const sessionUser = await findOrCreateOAuthUser({
            provider: "github",
            providerId: profile.id,
            email,
            username: profile.username,
            displayName: profile.displayName,
          });
          return done(null, sessionUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, toSessionUser(user));
  } catch (err) {
    done(err, null);
  }
});

module.exports = {
  getFrontendUrl,
  isOAuthProviderConfigured,
};
