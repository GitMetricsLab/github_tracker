const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ✅ FIXED: no next()
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next(); // Tells Mongoose hashing is done, save the document now
  } catch (err) {
    next(err); // Safely passes any encryption errors to the database handler
  }
});

// ✅ password comparison
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
