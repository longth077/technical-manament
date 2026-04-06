/**
 * Middleware to require authentication.
 * Redirects to signin page if user is not authenticated.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    if (req.accepts('html')) {
      return res.redirect('/signin.html');
    }
    return res.status(401).json({ errors: [{ msg: 'Authentication required' }] });
  }
  next();
}

/**
 * Middleware to redirect authenticated users away from auth pages.
 */
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard.html');
  }
  next();
}

module.exports = { requireAuth, redirectIfAuth };
