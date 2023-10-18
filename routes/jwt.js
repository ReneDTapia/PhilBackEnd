const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = user; // Adjunta la información del usuario al objeto de solicitud
    next();
  });
}

module.exports.authenticateToken = authenticateToken;