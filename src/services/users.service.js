const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

// GET PROFILE
const getProfile = async (userId) => {
    const user = await User.findById(userId).select('-password')
    if (!user) {
        throw { status: 404, message: 'Người dùng không tồn tại' }
    }
    return user
}

// CHANGE PASSWORD
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId)
    if (!user) {
        throw { status: 404, message: 'Người dùng không tồn tại' }
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
        throw { status: 401, message: 'Mật khẩu cũ không đúng' }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
}

module.exports = { getProfile, changePassword }
