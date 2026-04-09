const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { registerValidation, loginValidation } = require('../validations/auth.validation')

// POST /api/auth/register
router.post('/register', registerValidation, authController.register)

// POST /api/auth/login
router.post('/login', loginValidation, authController.login)

// POST /api/auth/logout
router.post('/logout', verifyToken, authController.logout)

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken)

module.exports = router
