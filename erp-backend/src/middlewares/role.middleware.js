module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: "Forbidden - You don't have permission to access this resource" 
      });
    }
    
    next();
  };
};
