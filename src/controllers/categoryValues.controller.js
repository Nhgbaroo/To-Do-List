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

module.exports = { createCategoryValue }
