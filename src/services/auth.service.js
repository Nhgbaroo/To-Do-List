const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES
} = require('../config/jwt')

// Tạo cặp token
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES
  })
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES
  })
  return { accessToken, refreshToken }
}

// REGISTER
const register = async ({ firstName, lastName, username, email, password, contactNumber, position }) => {
  // Kiểm tra email hoặc username đã tồn tại
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  })
  if (existingUser) {
    throw { status: 409, message: 'Email hoặc username đã tồn tại' }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Tạo user
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    contactNumber,
    position
  })

  // Tạo tokens
  const { accessToken, refreshToken } = generateTokens(user._id)

  // Trả về user đã loại bỏ password
  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, accessToken, refreshToken }
}

// LOGIN
const login = async ({ email, password }) => {
  // Tìm user theo email
  const user = await User.findOne({ email })
  if (!user) {
    throw { status: 401, message: 'Email hoặc mật khẩu không đúng' }
  }

  // So sánh password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw { status: 401, message: 'Email hoặc mật khẩu không đúng' }
  }

  // Tạo tokens
  const { accessToken, refreshToken } = generateTokens(user._id)

  const userObj = user.toObject()
  delete userObj.password

  return { user: userObj, accessToken, refreshToken }
}

// REFRESH TOKEN
const refreshToken = async (token) => {
  if (!token) {
    throw { status: 401, message: 'Refresh token không được cung cấp' }
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)

    // Kiểm tra user còn tồn tại không
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      throw { status: 401, message: 'User không tồn tại' }
    }

    // Tạo cặp token mới
    const tokens = generateTokens(user._id)

    return { user, ...tokens }
  } catch (error) {
    if (error.status) throw error
    throw { status: 403, message: 'Refresh token không hợp lệ hoặc đã hết hạn' }
  }
}

module.exports = { register, login, refreshToken }
