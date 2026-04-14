const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { cloudinary } = require('../config/cloudinary.config')

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

// UPDATE PROFILE
const updateProfile = async (userId, firstName, lastName, username, email, contactNumber, position) => {
    const user = await User.findById(userId)
    if (!user) {
        throw { status: 404, message: 'Người dùng không tồn tại' }
    }
    user.firstName = firstName
    user.lastName = lastName
    user.username = username
    user.email = email
    user.contactNumber = contactNumber
    user.position = position
    await user.save()
    return user
}

// UPDATE AVATAR
const updateAvatar = async (userId, file) => {
    const user = await User.findById(userId)
    if (!user) {
        throw { status: 404, message: 'Người dùng không tồn tại' }
    }
    
    if (file) {
        // Xóa ảnh cũ trên Cloudinary nếu có
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId)
        }
        user.avatar = file.path
        user.avatarPublicId = file.filename
        await user.save()
    }
    
    return user
}

module.exports = { getProfile, changePassword, updateProfile, updateAvatar }
