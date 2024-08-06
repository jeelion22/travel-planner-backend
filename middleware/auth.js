const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const auth = {
  isAuth: (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

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

  isAuthAdmin: (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
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
