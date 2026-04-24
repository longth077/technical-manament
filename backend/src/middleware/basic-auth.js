const basicAuth = require('basic-auth');

const authMiddleware = (authService) => async (req, res, next) => {
  try {
    const credentials = basicAuth(req);
    if (!credentials?.name || !credentials?.pass) {
      res.set('WWW-Authenticate', 'Basic realm="Technical Management"');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await authService.authenticate(credentials.name, credentials.pass);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
