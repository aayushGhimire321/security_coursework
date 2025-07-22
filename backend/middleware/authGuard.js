const jwt = require('jsonwebtoken');
const mongoSanitize = require('mongo-sanitize');
const Log = require('../models/logModel');

// Extract token from the 'Authorization' header
const extractTokenFromHeaders = (headers) => {
  const authHeader = headers['authorization'];
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  return token || null;
};

const logActivity = async (logData) => {
  try {
    // Sanitize and save log data
    await Log.create(mongoSanitize(logData));
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

// Public route guard (no token validation needed)
const publicGuard = async (req, res, next) => {
  // Sanitize request data
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  req.device = mongoSanitize(req.device);

  await logActivity({
    level: 'info',
    message: 'Public route accessed',
    method: req.method,
    url: req.originalUrl,
    user: 'guest',
    ip: req.ip,
  });

  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  next();
};

// Authenticated route guard (only allow requests with valid tokens)
const authGuard = async (req, res, next) => {
  // Sanitize request data
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  req.device = mongoSanitize(req.device);

  try {
    if (req.session.user) {
      req.user = req.session.user;

      // Log authenticated user
      await logActivity({
        level: 'info',
        message: 'Authenticated user',
        method: req.method,
        url: req.originalUrl,
        user: req.user.email,
        ip: req.ip,
      });

      // console.log(req.user);
      return next();
    }

    const token = extractTokenFromHeaders(req.headers); // Extract token from Authorization header

    if (!token) {
      // Log missing token
      await logActivity({
        level: 'warn',
        message: 'Authentication failed: Missing token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing',
      });
    }

    // Verify the JWT token
    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = mongoSanitize(decodedUserData); // Sanitize decoded user data

    await logActivity({
      level: 'info',
      message: 'Authentication successful',
      method: req.method,
      url: req.originalUrl,
      user: req.user.id,
      ip: req.ip,
    });

    next();
  } catch (error) {
    await logActivity({
      level: 'error',
      message: 'Authentication error',
      error: error.message,
      method: req.method,
      url: req.originalUrl,
      user: 'guest',
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message:
        error.name === 'JsonWebTokenError'
          ? 'Invalid token'
          : 'Authentication failed',
    });
  }
};

// Admin route guard (only allow requests from admin users)
const adminGuard = async (req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);
  req.device = mongoSanitize(req.device);

  try {
    if (req.session.user) {
      req.user = req.session.user;

      if (!req.user.isAdmin) {
        // Log missing token
        await logActivity({
          level: 'warn',
          message: 'Access denied: Admin access required',
          method: req.method,
          url: req.originalUrl,
          user: req.user.email,
          ip: req.ip,
        });
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin access required',
        });
      }

      await logActivity({
        level: 'info',
        message: 'Admin access granted',
        method: req.method,
        url: req.originalUrl,
        user: req.user.email,
        ip: req.ip,
      });

      // console.log(req.user);

      return next();
    }

    const token = extractTokenFromHeaders(req.headers); // Extract token from Authorization header

    if (!token) {
      // Log missing token
      await logActivity({
        level: 'warn',
        message: 'Access denied: Missing token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing',
      });
    }

    // Verify the JWT token
    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = mongoSanitize(decodedUserData); // Sanitize decoded user data

    // Check if the user is an admin
    const user = await userModel.findById(req.user.id);

    if (user.isAdmin) {
      await logActivity({
        level: 'info',
        message: 'Admin access granted',
        method: req.method,
        url: req.originalUrl,
        user: user.email,
        ip: req.ip,
      });
    }

    if (!user.isAdmin) {
      // Log missing token
      await logActivity({
        level: 'warn',
        message: 'Access denied: Admin access required',
        method: req.method,
        url: req.originalUrl,
        user: user.email,
        ip: req.ip,
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin access required',
      });
    }
  } catch (error) {
    await logActivity({
      level: 'error',
      message: 'Authorization error',
      error: error.message,
      method: req.method,
      url: req.originalUrl,
      user: 'guest',
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message:
        error.name === 'JsonWebTokenError'
          ? 'Invalid token'
          : 'Authorization failed',
    });
  }
};

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined!');
}

module.exports = {
  publicGuard,
  authGuard,
  adminGuard,
};
