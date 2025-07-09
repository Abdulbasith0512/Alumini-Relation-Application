// server/middleware/auth.js
// 🚨 DEVELOPMENT STUB — Replace with JWT/session auth for production.

function isAuthenticated(req, res, next) {
const User = require('../models/user'); // adjust path if needed

async function isAuthenticated(req, res, next) {
  console.log("Authenticating user...");

  const role = req.headers['x-dev-role'] || 'user';

  const devUsers = {
    user: '685a764f1932a255c47a1fba',
    superadmin: '68660a7014a49d73ef6092b4'
  };

  const userId = devUsers[role] || devUsers.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Dev user not found' });

    req.user = user; // ✅ Now has .premium and everything else
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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
