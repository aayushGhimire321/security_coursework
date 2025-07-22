const mongoose = require('mongoose');
const { sanitizeInput } = require('../service/purify');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verifyOTP: {
      type: Number,
      default: null,
    },
    verifyExpires: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordOTP: {
      type: Number,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    accountLockUntil: {
      type: Date,
      default: null, // Date until the account is locked
    },
    loginAttempts: {
      type: Number,
      default: 0, // Number of failed login attempts
    },
    loginTry: {
      type: Number,
      default: 0, // Track login attempts within a session
    },
    loginDevices: [],

    rememberedDevices: [],
    passwordExpiresAt: {
      type: Date,
      default: null,
    },
    oldPasswords: [],
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  // Sanitize the data
  if (this.device && Array.isArray(this.device)) {
    this.device = this.device.map((item) => sanitizeInput(item));
  }
  if (this.rememberedDevice && Array.isArray(this.rememberedDevice)) {
    this.rememberedDevice = this.rememberedDevice.map((item) =>
      sanitizeInput(item)
    );
  }
  next();
});

// Define a virtual property to check if the account is locked
userSchema.virtual('isLocked').get(function () {
  return this.accountLockUntil && this.accountLockUntil > Date.now();
});

// Pre-save hook to reset login attempts if account lock has expired
userSchema.pre('save', function (next) {
  if (this.accountLockUntil && this.accountLockUntil <= Date.now()) {
    this.accountLockUntil = null;
    this.loginAttempts = 0;
  }
  next();
});

// Instance method to increment login attempts and lock account if necessary
userSchema.methods.incrementLoginAttempts = async function () {
  const MAX_LOGIN_ATTEMPTS = 5; // Maximum allowed login attempts
  const LOCK_TIME = 5 * 60 * 1000; // Lock duration in milliseconds (e.g., 5 minutes)

  if (this.isLocked) {
    // Account is currently locked
    return;
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    this.accountLockUntil = Date.now() + LOCK_TIME;
  }

  await this.save();
};

// Instance method to reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.accountLockUntil = null;
  await this.save();
};

// Instance method to check if the user has exceeded the maximum login attempts
userSchema.methods.hasExceededMaxLoginAttempts = function () {
  return this.loginAttempts >= 5;
};

// reset the account lock
userSchema.methods.resetAccountLock = async function () {
  this.accountLockUntil = null;
  await this.save();
};

const User = mongoose.model('users', userSchema);
module.exports = User;
