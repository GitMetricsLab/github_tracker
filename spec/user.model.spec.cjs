const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/github_tracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with hashed password', async () => {
    const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const user = new User(userData);
    await user.save();
    expect(user.password).not.toBe(userData.password);
    const isMatch = await bcrypt.compare('password123', user.password);
    expect(isMatch).toBeTrue();
  });

  it('should not hash password again if not modified', async () => {
    const userData = { username: 'testuser2', email: 'test2@example.com', password: 'password123' };
    const user = new User(userData);
    await user.save();
    const originalHash = user.password;
    user.username = 'updateduser';
    await user.save();
    expect(user.password).toBe(originalHash);
  });

  it('should compare passwords correctly', async () => {
    const userData = { username: 'testuser3', email: 'test3@example.com', password: 'password123' };
    const user = new User(userData);
    await user.save();
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBeTrue();
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBeFalse();
  });
}); 