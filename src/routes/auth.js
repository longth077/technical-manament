const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../database');

const router = express.Router();

const SALT_ROUNDS = 10;

// Validation rules
const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('fullName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Full name is required and must be at most 100 characters'),
];

const signinValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// POST /api/auth/signup
router.post('/signup', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, fullName } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = db.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).get(username, email);

    if (existingUser) {
      return res.status(409).json({
        errors: [{ msg: 'Username or email already exists' }],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(username, email, hashedPassword, fullName);

    // Set session
    req.session.userId = result.lastInsertRowid;
    req.session.username = username;

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: result.lastInsertRowid,
        username,
        email,
        fullName,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
});

// POST /api/auth/signin
router.post('/signin', signinValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Find user by username
    const user = db.prepare(
      'SELECT id, username, email, password, full_name, role FROM users WHERE username = ?'
    ).get(username);

    if (!user) {
      return res.status(401).json({
        errors: [{ msg: 'Invalid username or password' }],
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        errors: [{ msg: 'Invalid username or password' }],
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ errors: [{ msg: 'Failed to logout' }] });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ errors: [{ msg: 'Not authenticated' }] });
  }

  const user = db.prepare(
    'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?'
  ).get(req.session.userId);

  if (!user) {
    return res.status(401).json({ errors: [{ msg: 'User not found' }] });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at,
    },
  });
});

module.exports = router;
