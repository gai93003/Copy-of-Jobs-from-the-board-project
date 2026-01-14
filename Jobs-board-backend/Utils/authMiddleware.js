import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Middleware to authenticate requests
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to request
    next();
  });
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; 

    if (!user || !allowedRoles.includes(user.user_role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
}

export { authenticate, requireRole };
