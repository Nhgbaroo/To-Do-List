const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { uploadSingleImage } = require('../middlewares/upload.middleware')

const { changePasswordValidation, updateProfileValidation } = require('../validations/users.validation')

// GET /api/users/profile
router.get('/profile', verifyToken, usersController.getProfile)

// PUT /api/users/change-password
router.put('/change-password', verifyToken, changePasswordValidation, usersController.changePassword)

// PUT /api/users/update-profile
router.put('/update-profile', verifyToken, updateProfileValidation, usersController.updateProfile)

// PUT /api/users/update-avatar
router.put('/update-avatar', verifyToken, uploadSingleImage('avatar'), usersController.updateAvatar)

module.exports = router
