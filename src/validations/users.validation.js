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
    const { firstName, lastName, username, email, contactNumber } = req.body

    if (!firstName) {
        return res.status(400).json({ message: 'Vui lòng nhập tên' })
    }

    if (!lastName) {
        return res.status(400).json({ message: 'Vui lòng nhập họ' })
    }

    if (!username) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập' })
    }

    if (username.length < 3) {
        return res.status(400).json({ message: 'Username phải có ít nhất 3 ký tự' })
    }

    if (!email) {
        return res.status(400).json({ message: 'Vui lòng nhập email' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email không đúng định dạng' })
    }

    // contactNumber là tùy chọn, chỉ validate format nếu có nhập
    if (contactNumber) {
        if (!/^\d+$/.test(contactNumber)) {
            return res.status(400).json({ message: 'Số điện thoại chỉ được chứa số' })
        }
        if (contactNumber.length > 15) {
            return res.status(400).json({ message: 'Số điện thoại không được vượt quá 15 ký tự' })
        }
    }

    next()
}

module.exports = { changePasswordValidation, updateProfileValidation }