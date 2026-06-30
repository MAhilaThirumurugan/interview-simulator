const rateLimit = require('express-rate-limit');

// General API protection
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later' },
});

// Strict limit on AI-powered endpoints (these cost money!)
exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { message: 'AI request limit reached. Try again in an hour.' },
});