const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Initialize database (creates tables if they don't exist)
require('./src/database');

const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Generate or load a persistent session secret
const secretPath = path.join(__dirname, 'data', '.session-secret');
function getSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, 'utf8').trim();
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(secretPath, secret, { mode: 0o600 });
  return secret;
}

const sessionSecret = getSessionSecret();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
    },
  })
);

// CSRF protection via session-based tokens
function generateCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function csrfProtection(req, res, next) {
  // Skip CSRF check for GET/HEAD/OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  const token = req.headers['x-csrf-token'];
  if (!token || !req.session.csrfToken || token !== req.session.csrfToken) {
    return res.status(403).json({ errors: [{ msg: 'Invalid or missing CSRF token' }] });
  }
  next();
}

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { errors: [{ msg: 'Too many requests, please try again later.' }] },
});

// Provide CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = generateCsrfToken(req);
  res.json({ csrfToken: token });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes - apply rate limiting and CSRF protection
app.use('/api/auth', authLimiter, csrfProtection, authRoutes);

// Root redirect
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard.html');
  }
  res.redirect('/signin.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
