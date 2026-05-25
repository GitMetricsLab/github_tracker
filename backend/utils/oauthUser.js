const User = require("../models/User");

function toSessionUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    provider: user.provider,
  };
}

async function ensureUniqueUsername(baseUsername) {
  const sanitized = (baseUsername || "user")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .slice(0, 30) || "user";

  let username = sanitized;
  let suffix = 0;

  while (await User.findOne({ username })) {
    suffix += 1;
    username = `${sanitized.slice(0, 24)}_${suffix}`;
  }

  return username;
}

/**
 * Find or create a user from an OAuth provider profile.
 */
async function findOrCreateOAuthUser({ provider, providerId, email, username, displayName }) {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!providerId) {
    throw new Error("OAuth profile is missing a provider id");
  }

  let user = await User.findOne({ provider, providerId });

  if (user) {
    return toSessionUser(user);
  }

  if (normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (user.provider === "local" && user.password) {
        user.provider = provider;
        user.providerId = providerId;
        await user.save();
        return toSessionUser(user);
      }

      if (user.provider === provider) {
        user.providerId = providerId;
        await user.save();
        return toSessionUser(user);
      }

      throw new Error("An account with this email already exists using a different sign-in method");
    }
  }

  const uniqueUsername = await ensureUniqueUsername(
    username || displayName || normalizedEmail?.split("@")[0]
  );

  user = await User.create({
    username: uniqueUsername,
    email: normalizedEmail || `${providerId}@${provider}.oauth.local`,
    provider,
    providerId,
  });

  return toSessionUser(user);
}

function isOAuthProviderConfigured(provider) {
  if (provider === "google") {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }
  if (provider === "github") {
    return Boolean(process.env.GITHUB_OAUTH_CLIENT_ID && process.env.GITHUB_OAUTH_CLIENT_SECRET);
  }
  return false;
}

module.exports = {
  findOrCreateOAuthUser,
  toSessionUser,
  isOAuthProviderConfigured,
  ensureUniqueUsername,
};
