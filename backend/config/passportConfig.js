const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Use GitHub sign in for this account",
          });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
        state: true,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const primaryEmail = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value || "";

          let user = await User.findOne({ githubId: profile.id });

          if (!user && primaryEmail) {
            user = await User.findOne({ email: primaryEmail });
          }

          if (!user) {
            const loginName =
              profile.username || `github_${profile.id}`;

            const uniqueSuffix = Math.random()
              .toString(36)
              .slice(2, 7);

            const userData = {
              githubId: profile.id,
              username: `${loginName}_${uniqueSuffix}`,
              avatar,
            };

            if (primaryEmail) {
              userData.email = primaryEmail;
            }

            user = new User(userData);

          } else {
            user.githubId = user.githubId || profile.id;

            if (primaryEmail) {
              user.email = user.email || primaryEmail;
            }

            user.avatar = user.avatar || avatar;
          }

          await user.save();

          return done(null, {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          });

        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});