const mongoose = require('mongoose');
const User = require('../backend/models/User');
const {
  findOrCreateOAuthUser,
  ensureUniqueUsername,
} = require('../backend/utils/oauthUser');

describe('OAuth user utilities', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/github_tracker_test');
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new OAuth user without a password', async () => {
    const sessionUser = await findOrCreateOAuthUser({
      provider: 'github',
      providerId: '12345',
      email: 'oauth@example.com',
      username: 'oauth_user',
    });

    expect(sessionUser.email).toBe('oauth@example.com');
    expect(sessionUser.provider).toBe('github');

    const stored = await User.findOne({ provider: 'github', providerId: '12345' });
    expect(stored).toBeTruthy();
    expect(stored.password).toBeUndefined();
  });

  it('should return the same user for repeated OAuth logins', async () => {
    const first = await findOrCreateOAuthUser({
      provider: 'google',
      providerId: 'google-1',
      email: 'google@example.com',
      username: 'google_user',
    });

    const second = await findOrCreateOAuthUser({
      provider: 'google',
      providerId: 'google-1',
      email: 'google@example.com',
      username: 'google_user',
    });

    expect(second.id).toBe(first.id);
  });

  it('should generate unique usernames when collisions occur', async () => {
    await User.create({
      username: 'duplicate',
      email: 'first@example.com',
      password: 'Password1!',
      provider: 'local',
    });

    const username = await ensureUniqueUsername('duplicate');
    expect(username).not.toBe('duplicate');
  });
});
