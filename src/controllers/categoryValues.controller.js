const categoryValueService = require('../services/categoryValues.service')

// CREATE CATEGORY VALUE
const createCategoryValue = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { name, slug, color, order, isSystem, isDefault } = req.body
    const userId = req.user._id

    const categoryValue = await categoryValueService.createCategoryValue({
      name,
      slug,
      color,
      order,
      isSystem,
      isDefault,
      categoryId,
      userId
    })

    return res.status(201).json({
      message: 'Tạo category value thành công',
      categoryValue
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// GET CATEGORY VALUES BY CATEGORY ID
const getCategoryValuesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params
    const userId = req.user._id

    const categoryValues = await categoryValueService.getCategoryValuesByCategoryId({
      categoryId,
      userId
    })

    return res.status(200).json({
      message: 'Lấy category values thành công',
      categoryValues
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// GET ALL CATEGORY VALUES BY USER ID
const getAllCategoryValuesByUserId = async (req, res) => {
  try {
    const userId = req.user._id

    const categoryValues = await categoryValueService.getAllCategoryValuesByUserId({
      userId
    })

    return res.status(200).json({
      message: 'Lấy category values thành công',
      categoryValues
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// UPDATE CATEGORY VALUE BY ID
const updateCategoryValueById = async (req, res) => {
  try {
    const { categoryValueId } = req.params
    const { name, slug, color, order, isSystem, isDefault } = req.body
    const userId = req.user._id

    const categoryValue = await categoryValueService.updateCategoryValueById({
      categoryValueId,
      name,
      slug,
      color,
      order,
      isSystem,
      isDefault,
      userId
    })

    return res.status(200).json({
      message: 'Cập nhật category value thành công',
      categoryValue
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

// DELETE CATEGORY VALUE BY ID
const deleteCategoryValueById = async (req, res) => {
  try {
    const { categoryValueId } = req.params
    const userId = req.user._id

    await categoryValueService.deleteCategoryValueById({
      categoryValueId,
      userId
    })

    return res.status(200).json({
      message: 'Xóa category value thành công'
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Lỗi server'
    })
  }
}

module.exports = { createCategoryValue, getCategoryValuesByCategoryId, getAllCategoryValuesByUserId, updateCategoryValueById, deleteCategoryValueById }
