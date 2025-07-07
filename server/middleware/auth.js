// server/middleware/auth.js

// Dummy middleware for development/testing. DO NOT USE IN PRODUCTION.
function isAuthenticated(req, res, next) {
  console.log("Authenticating user...");
  req.user = { _id: 'dummyuserid', role: 'user' }; // Inject dummy user
  next();
}

// Middleware to allow only users with 'superadmin' role
function isSuperAdmin(req, res, next) {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Only super admin allowed' });
  }
  next();
}

// Reusable middleware to allow specific roles
function allowRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: `Only ${role} allowed` });
    }
    next();
  };
}

module.exports = { isAuthenticated, isSuperAdmin, allowRole };
