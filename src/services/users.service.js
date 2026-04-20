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

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
}

// UPDATE PROFILE
const updateProfile = async (userId, { firstName, lastName, username, email, contactNumber, position }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw { status: 404, message: 'Người dùng không tồn tại' }
  }

  // Kiểm tra trùng lặp với user khác (loại trừ chính user hiện tại)
  const orConditions = []
  if (username) orConditions.push({ username })
  if (email) orConditions.push({ email })
  if (contactNumber) orConditions.push({ contactNumber })

  if (orConditions.length > 0) {
    const conflictUser = await User.findOne({ _id: { $ne: userId }, $or: orConditions })
    if (conflictUser) {
      if (username && conflictUser.username === username)
        throw { status: 409, message: 'Username đã được sử dụng' }
      if (email && conflictUser.email === email)
        throw { status: 409, message: 'Email đã được sử dụng' }
      if (contactNumber && conflictUser.contactNumber === contactNumber)
        throw { status: 409, message: 'Số điện thoại đã được sử dụng' }
    }
  }

  user.firstName = firstName
  user.lastName = lastName
  user.username = username
  user.email = email
  user.contactNumber = contactNumber || null
  user.position = position

  try {
    await user.save()
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0]
      const messages = {
        email: 'Email đã được sử dụng',
        username: 'Username đã được sử dụng',
        contactNumber: 'Số điện thoại đã được sử dụng'
      }
      throw { status: 409, message: messages[field] || 'Thông tin đã tồn tại' }
    }
    throw err
  }

  const userObj = user.toObject()
  delete userObj.password
  return userObj
}

// UPDATE AVATAR
const updateAvatar = async (userId, file) => {
  const user = await User.findById(userId)
  if (!user) {
    throw { status: 404, message: 'Người dùng không tồn tại' }
  }

  // Xóa ảnh cũ trên Cloudinary nếu có
  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId)
  }

  user.avatar = file.path
  user.avatarPublicId = file.filename
  await user.save()

  const userObj = user.toObject()
  delete userObj.password
  return userObj
}

module.exports = { getProfile, changePassword, updateProfile, updateAvatar }
