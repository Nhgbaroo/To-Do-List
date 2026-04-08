const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('../config/jwt')
const User = require('../models/user.model')

const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token không được cung cấp' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)

    // Kiểm tra user còn tồn tại
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' })
    }

    // Gắn user vào request
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token đã hết hạn' })
    }
    return res.status(403).json({ message: 'Access token không hợp lệ' })
  }
}

module.exports = { verifyToken }
