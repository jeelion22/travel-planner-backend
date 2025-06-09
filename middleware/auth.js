const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BlockedToken = require("../models/blockedToken");

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

const auth = {
  isAuth: async (req, res, next) => {
    // const token = req.cookies.token;

    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const isBlocked = await BlockedToken.findOne({ token });

    isBlocked && res.status(403).json({ message: "Token is revoked." });

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userId = decodedToken.id;

      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  },

  isAuthAdmin: async (req, res, next) => {
    // const token = req.cookies.token;

    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const isBlocked = await BlockedToken.findOne({ token });

    isBlocked && res.status(403).json({ message: "Token is revoked." });

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);

      if (decodedToken.id && decodedToken.userType === "admin") {
        req.userId = decodedToken.id;

        req.userType = decodedToken.userType;
        next();
      } else {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
      } else if (err.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expired" });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  },
};

module.exports = auth;
