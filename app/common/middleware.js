const jwt = require('jsonwebtoken');
const User = require('../users/model');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(200).json({ error: 'Unauthorized - No token provided' });
  
    try {
      let searchParam = {}
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      if (decoded.googleId) searchParam['googleId'] = decoded.googleId
      else searchParam['email'] = decoded.email
      const user = await User.findOne(searchParam);
      if (!user) return res.status(401).json({ error: 'Unauthorized - Invalid user' });
      if (!user.isActive) return res.status(401).json({ error: 'User account Deleted' });
      req.user = user
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(200).json({ error: 'Unauthorized - No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const { email } = decoded
    if (!email || email !== 'admin@aganpankh.admin.com') return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  } 
};

module.exports = { authenticateUser, adminAuthMiddleware};