const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

// POST /api/auth/register
router.post('/register', authController.register)

// POST /api/auth/login
router.post('/login', authController.login)

// POST /api/auth/logout (cần đăng nhập mới logout được)
router.post('/logout', verifyToken, authController.logout)

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken)

module.exports = router
