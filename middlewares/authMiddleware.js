const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Assuming Bearer token
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token

    const foundUser = await User.findById(user.id);
    if (!foundUser) return res.sendStatus(404); // User not found

    req.user = foundUser; // Attach user to request object
    next();
  });
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};
const isTeacher = async (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "Teacher")) {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};
const isStudent = async (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "Admin" ||
      req.user.role === "Teacher" ||
      req.user.role === "Student")
  ) {
    return next();
  }
  res.status(403).json({ message: "Access denied." });
};
module.exports = { authenticateToken, isAdmin, isTeacher, isStudent };
