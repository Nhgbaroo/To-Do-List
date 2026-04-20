const jwt = require('jsonwebtoken')
const authService = require('../services/auth.service')
const tokenBlacklistService = require('../services/tokenBlacklist.service')
const { REFRESH_TOKEN_EXPIRES_MS } = require('../config/jwt')

// Tập trung cookie options để tránh lặp lại
const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: REFRESH_TOKEN_EXPIRES_MS
})

// REGISTER
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, contactNumber, position } = req.body

    const { user, accessToken, refreshToken } = await authService.register({
      firstName,
      lastName,
      username,
      email,
      password,
      contactNumber,
      position
    })

    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions())

    return res.status(201).json({
      message: 'Đăng ký thành công',
      user,
      accessToken
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const { user, accessToken, refreshToken } = await authService.login({ email, password })

    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions())

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user,
      accessToken
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// LOGOUT
const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const accessToken = authHeader.split(' ')[1]

    // Decode token để lấy thời gian hết hạn (exp), rồi blacklist
    const decoded = jwt.decode(accessToken)
    if (decoded?.exp) {
      await tokenBlacklistService.addToBlacklist(accessToken, decoded.exp)
    }

    // Xoá refreshToken cookie (dùng cùng path/domain để khớp)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' })
  }
}

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken

    const { user, accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken(token)

    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions())

    return res.status(200).json({
      message: 'Refresh token thành công',
      user,
      accessToken
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

module.exports = { register, login, logout, refreshToken }
