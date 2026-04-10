const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

const { changePasswordValidation, updateProfileValidation } = require('../validations/users.validation')

// GET /api/users/profile
router.get('/profile', verifyToken, usersController.getProfile)

// PUT /api/users/change-password
router.put('/change-password', verifyToken, changePasswordValidation, usersController.changePassword)

// PUT /api/users/update-profile
router.put('/update-profile', verifyToken, updateProfileValidation, usersController.updateProfile)

module.exports = router
