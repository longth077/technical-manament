const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/AuthController');
const { signupRules, signinRules } = require('../validators/authValidator');
const validate = require('../validators/validate');

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' },
});

router.post('/signup', authLimiter, signupRules, validate, authController.postSignup);
router.post('/signin', authLimiter, signinRules, validate, authController.postSignin);
router.post('/logout', authController.postLogout);
router.get('/me', authController.getMe);

module.exports = router;
