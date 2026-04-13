const authService = require('../services/AuthService');

class AuthController {
  async postSignup(req, res, next) {
    try {
      const user = await authService.signup(req.body);
      req.session.userId = user.id;
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      next(error);
    }
  }

  async postSignin(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await authService.signin(username, password);
      req.session.userId = user.id;
      res.json({ message: 'Signed in successfully', user });
    } catch (error) {
      next(error);
    }
  }

  async postLogout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const user = await authService.getProfile(req.session.userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
