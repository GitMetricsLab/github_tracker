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
      required: function requiredEmail() {
        return !this.githubId;
      },
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: function requiredPassword() {
        return !this.githubId;
      },
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
    type: String,
  },
});

UserSchema.pre('save', async function (next) {

    if (!this.isModified('password'))
        return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      return next(err);
    }
});

// Compare passwords during login
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password)
    return false;

    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
