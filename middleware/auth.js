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
};

module.exports = auth;
