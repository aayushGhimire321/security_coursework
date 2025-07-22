const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    method: {
      type: String,
    },
    url: {
      type: String,
    },
    user: {
      type: String, // Stores user ID or "guest" for public routes
    },
    ip: {
      type: String,
    },
    error: {
      type: String, // Optional, used for logging error messages
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
