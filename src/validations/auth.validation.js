// REGISTER
const registerValidation = (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body

  // Kiểm tra các field bắt buộc
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' })
  }

  // Kiểm tra độ dài firstName và lastName
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).json({ message: 'Họ và tên phải có ít nhất 2 ký tự' })
  }

  // Kiểm tra username: không có khoảng trắng, ít nhất 3 ký tự
  if (username.length < 3) {
    return res.status(400).json({ message: 'Username phải có ít nhất 3 ký tự' })
  }
  if (/\s/.test(username)) {
    return res.status(400).json({ message: 'Username không được chứa khoảng trắng' })
  }

  // Kiểm tra email đúng format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không đúng định dạng' })
  }

  // Kiểm tra password: ít nhất 6 ký tự
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  }

  next()
}

// LOGIN
const loginValidation = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
  }

  // Kiểm tra email đúng format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không đúng định dạng' })
  }

  next()
}

module.exports = { registerValidation, loginValidation }
