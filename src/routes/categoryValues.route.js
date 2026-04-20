const express = require('express')
const router = express.Router()
const categoryValueController = require('../controllers/categoryValues.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createCategoryValueValidation, updateCategoryValueValidation } = require('../validations/categoryValues.validation')

// POST /api/category-values/:categoryId
router.post('/:categoryId', verifyToken, createCategoryValueValidation, categoryValueController.createCategoryValue)

// GET /api/category-values
router.get('/', verifyToken, categoryValueController.getAllCategoryValuesByUserId)

// GET /api/category-values/detail/:categoryValueId
router.get('/detail/:categoryValueId', verifyToken, categoryValueController.getCategoryValueById)

// GET /api/category-values/:categoryId
router.get('/:categoryId', verifyToken, categoryValueController.getCategoryValuesByCategoryId)

// PUT /api/category-values/:categoryValueId
router.put('/:categoryValueId', verifyToken, updateCategoryValueValidation, categoryValueController.updateCategoryValueById)

// DELETE /api/category-values/:categoryValueId
router.delete('/:categoryValueId', verifyToken, categoryValueController.deleteCategoryValueById)

module.exports = router
