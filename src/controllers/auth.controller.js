const authService = require('../services/auth.service')

// REGISTER
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, contactNumber, position } = req.body

    // Validate input
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' })
    }

    const { user, accessToken, refreshToken } = await authService.register({
      firstName,
      lastName,
      username,
      email,
      password,
      contactNumber,
      position
    })

    // Set refreshToken vào httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    })

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

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
    }

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password
    })

    // Set refreshToken vào httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

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
    // Xoá refreshToken cookie
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

    // Set refreshToken mới vào cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

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
