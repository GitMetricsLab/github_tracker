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

  it('should hash password again when password is modified', async () => {
  const user = new User({
    username: 'testuser4',
    email: 'test4@example.com',
    password: 'password123',
  });

  await user.save();

  const oldHash = user.password;

  user.password = 'newpassword123';
  await user.save();

  expect(user.password).not.toBe(oldHash);

  const isMatch = await bcrypt.compare('newpassword123', user.password);
  expect(isMatch).toBeTrue();
});

it('should reject user without email', async () => {
  const user = new User({
    username: 'testuser5',
    password: 'password123',
  });

  await expectAsync(user.save()).toBeRejected();
});

it('should reject user without username', async () => {
  const user = new User({
    email: 'test5@example.com',
    password: 'password123',
  });

  await expectAsync(user.save()).toBeRejected();
});

it('should reject user without password', async () => {
  const user = new User({
    username: 'testuser6',
    email: 'test6@example.com',
  });

  await expectAsync(user.save()).toBeRejected();
});

it('should fail password comparison for empty password', async () => {
  const user = new User({
    username: 'testuser7',
    email: 'test7@example.com',
    password: 'password123',
  });

  await user.save();

  const isMatch = await user.comparePassword('');
  expect(isMatch).toBeFalse();
});

it('should generate different hashes for same password', async () => {
  const user1 = new User({
    username: 'user1',
    email: 'user1@example.com',
    password: 'samepassword',
  });

  const user2 = new User({
    username: 'user2',
    email: 'user2@example.com',
    password: 'samepassword',
  });

  await user1.save();
  await user2.save();

  expect(user1.password).not.toBe(user2.password);
});

}); 
