const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

const requireWriteAccess = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  if (req.user.role === 'readonly') {
    return res.status(403).json({ message: 'Read-only role cannot edit data' });
  }
  next();
};

module.exports = { requireRole, requireWriteAccess };
