const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Read token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains ONLY role
    // { role: "admin" } or { role: "user" }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
