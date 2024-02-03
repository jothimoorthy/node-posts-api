// authMiddleware.js
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "Unauthorized: Token is missing" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

// Helper function to generate JWT token
async function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: "15min",
  });
}

module.exports = {
  verifyToken,
  generateToken,
};
