const express = require('express')
const router = express.Router()
const categoryValueController = require('../controllers/categoryValues.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createCategoryValueValidation } = require('../validations/categoryValues.validation')

// POST /api/category-values/:categoryId
router.post('/:categoryId', verifyToken, createCategoryValueValidation, categoryValueController.createCategoryValue)

module.exports = router
