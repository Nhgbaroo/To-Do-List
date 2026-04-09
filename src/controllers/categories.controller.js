const categoryService = require('../services/categories.service')

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, slug, order, isSystem } = req.body
    const userId = req.user._id

    const category = await categoryService.createCategory({
      name,
      slug,
      order,
      isSystem,
      userId
    })

    return res.status(201).json({
      message: 'Tạo category thành công',
      category
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await categoryService.getCategoriesByUserId(userId)

    return res.status(200).json({
      message: 'Lấy danh sách category thành công',
      categories
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const category = await categoryService.getCategoryById(id)

    return res.status(200).json({
      message: 'Lấy category thành công',
      category
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// UPDATE CATEGORY BY ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, slug, order, isSystem } = req.body

    const category = await categoryService.updateCategoryById(id, {
      name,
      slug,
      order,
      isSystem
    })

    return res.status(200).json({
      message: 'Cập nhật category thành công',
      category
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// DELETE CATEGORY BY ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategoryById(id)

    return res.status(200).json({
      message: 'Xoá category thành công'
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory }
