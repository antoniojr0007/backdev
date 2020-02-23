const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    select: false,
    min: 6,
    max: 1024,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  tokenUsed: {
    type: Boolean,
    default: false,
    select: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserAuthSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const UserAuth = mongoose.model('UserAuth', UserAuthSchema);

module.exports = UserAuth;
