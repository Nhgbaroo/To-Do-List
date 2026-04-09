const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categories.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createCategoryValidation } = require('../validations/categories.validation')

// POST /api/categories
router.post('/', verifyToken, createCategoryValidation, categoryController.createCategory)

// GET /api/categories (lấy tất cả categories của user)
router.get('/', verifyToken, categoryController.getCategories)

// GET /api/categories/:id (lấy 1 category theo id)
router.get('/:id', verifyToken, categoryController.getCategoryById)

module.exports = router
