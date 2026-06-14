const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'No token provided' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.tokenVersion !== decoded.tokenVersion) return res.status(401).json({ message: 'Session expired, please login again' })

    req.user = user
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = auth
