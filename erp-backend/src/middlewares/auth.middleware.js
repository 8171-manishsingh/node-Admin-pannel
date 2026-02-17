const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({ msg: "Account is deactivated" });
      }

      req.user = decoded;
      req.user.fullInfo = user;
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
