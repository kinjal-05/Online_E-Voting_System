
const jwt = require('jsonwebtoken');
require('dotenv').config();
const protect = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.YOUR_TOKEN); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
