const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');

describe('User Model', () => {
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

  // -------- CREATE USER --------
  it('should hash password before saving user', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    await user.save();

    // password should not be plain text
    expect(user.password).not.toBe('password123');

    const isMatch = await bcrypt.compare('password123', user.password);
    expect(isMatch).toBe(true);
  });

  // -------- PASSWORD NOT RE-HASHED --------
  it('should not re-hash password if not modified', async () => {
    const user = await User.create({
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'password123',
    });

    const originalHash = user.password;

    user.username = 'updateduser';
    await user.save();

    expect(user.password).toBe(originalHash);
  });

  // -------- OAUTH USER --------
  it('should allow OAuth users without a password', async () => {
    const user = await User.create({
      username: 'oauthuser',
      email: 'oauth@example.com',
      provider: 'github',
      providerId: 'gh-123',
    });

    expect(user.password).toBeUndefined();
    const isMatch = await user.comparePassword('anything');
    expect(isMatch).toBe(false);
  });

  // -------- COMPARE PASSWORD --------
  it('should correctly compare passwords', async () => {
    const user = await User.create({
      username: 'testuser3',
      email: 'test3@example.com',
      password: 'password123',
    });

    const isMatch = await user.comparePassword('password123');
    const isNotMatch = await user.comparePassword('wrongpassword');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });
});