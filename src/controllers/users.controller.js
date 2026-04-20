const userService = require('../services/users.service')

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await userService.getProfile(userId)
        return res.status(200).json({
            message: 'Lấy thông tin cá nhân thành công',
            user
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Lỗi server'
        })
    }
}

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await userService.updateProfile(userId, req.body)
        return res.status(200).json({
            message: 'Cập nhật thông tin cá nhân thành công',
            user
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Lỗi server'
        })
    }
}

// UPDATE AVATAR
const updateAvatar = async (req, res) => {
    try {
        const userId = req.user._id
        const file = req.file
        
        if (!file) {
            return res.status(400).json({
                message: 'Vui lòng tải lên một ảnh đại diện'
            })
        }

        const user = await userService.updateAvatar(userId, file)
        return res.status(200).json({
            message: 'Cập nhật ảnh đại diện thành công',
            user
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Lỗi server'
        })
    }
}

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id
        const { oldPassword, newPassword } = req.body
        await userService.changePassword(userId, oldPassword, newPassword)
        return res.status(200).json({
            message: 'Đổi mật khẩu thành công'
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Lỗi server'
        })
    }
}

module.exports = { getProfile, changePassword, updateProfile, updateAvatar }