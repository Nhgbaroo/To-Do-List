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

// UPDATE PROFILE
const updateProfileValidation = (req, res, next) => {
    const { firstName, lastName, username, email, contactNumber, position } = req.body

    if (!firstName) {
        return res.status(400).json({ message: 'Vui lòng nhập tên' })
    }

    if (!lastName) {
        return res.status(400).json({ message: 'Vui lòng nhập họ' })
    }

    if (!username) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập' })
    }

    if (!email) {
        return res.status(400).json({ message: 'Vui lòng nhập email' })
    }

    if (!contactNumber) {
        return res.status(400).json({ message: 'Vui lòng nhập số điện thoại' })
    }

    if (!position) {
        return res.status(400).json({ message: 'Vui lòng nhập chức vụ' })
    }

    next()
}

module.exports = { changePasswordValidation, updateProfileValidation }