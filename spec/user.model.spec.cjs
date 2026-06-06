const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/github_tracker_test');
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