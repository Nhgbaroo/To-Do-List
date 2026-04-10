// CHANGE PASSWORD
const changePasswordValidation = (req, res, next) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ' })
    }

    if (!newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu mới' })
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    }

    if (oldPassword === newPassword) {
        return res.status(400).json({ message: 'Mật khẩu mới không được trùng với mật khẩu cũ' })
    }

    next()
}

module.exports = { changePasswordValidation }