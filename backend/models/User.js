const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PROVIDERS = ["local", "google", "github"];

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
    required: function requiredPassword() {
      return this.provider === "local";
    },
  },
  provider: {
    type: String,
    enum: PROVIDERS,
    default: "local",
  },
  providerId: {
    type: String,
    sparse: true,
  },
});

UserSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

UserSchema.pre("save", async function hashPasswordIfPresent() {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
