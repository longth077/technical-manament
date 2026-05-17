const { body } = require('express-validator');

const signupValidator = [
  body('username').trim().isLength({ min: 3, max: 255 }),
  body('email').trim().isEmail(),
  body('password').isLength({ min: 8, max: 255 }),
  body('fullName').trim().isLength({ min: 1, max: 255 }),
];

module.exports = { signupValidator };
