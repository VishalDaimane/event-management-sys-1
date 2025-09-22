// Middleware for authentication & admin check
// Assumes you store user info in req.user after login

function isAuthenticated(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: "Login required" });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ error: "Admin access required" });
}

module.exports = { isAuthenticated, isAdmin };
