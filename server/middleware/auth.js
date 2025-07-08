// server/middleware/auth.js
// 🚨 DEVELOPMENT STUB — Replace with JWT/session auth for production.

function isAuthenticated(req, res, next) {
  console.log("Authenticating user...");
  const role = req.headers['x-dev-role'] || 'user';
  req.user = { _id: 'dummyuserid', role }; // dev role override
  next();
}

function isSuperAdmin(req, res, next) {
  if (req.user?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Only super admin allowed' });
  }
  next();
}

function allowRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: `Only ${role} allowed` });
    }
    next();
  };
}

module.exports = { isAuthenticated, isSuperAdmin, allowRole };
