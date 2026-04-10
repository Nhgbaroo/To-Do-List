const Category = require('../models/categories.model')

// CREATE CATEGORY
const createCategory = async ({ name, slug, order, isSystem, userId }) => {
  // Kiểm tra slug đã tồn tại cho user này chưa
  const existingCategory = await Category.findOne({ slug, userId })
  if (existingCategory) {
    throw { status: 409, message: 'Category với slug này đã tồn tại' }
  }

  // Kiểm tra order đã tồn tại cho user này chưa
  if (order !== undefined && order !== null) {
    const existingOrder = await Category.findOne({ order, userId })
    if (existingOrder) {
      throw { status: 409, message: 'Order này đã tồn tại trong danh sách category' }
    }
  }

  const category = await Category.create({
    name,
    slug,
    order,
    isSystem,
    userId
  })

  return category
}

// GET ALL CATEGORIES BY USER ID
const getCategoriesByUserId = async (userId) => {
  const categories = await Category.find({ userId }).sort({ order: 1 })
  return categories
}

// GET CATEGORY BY ID
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw { status: 404, message: 'Category không tồn tại' }
  }
  return category
}

// UPDATE CATEGORY BY ID
const updateCategoryById = async (categoryId, updateData) => {
  // Kiểm tra category tồn tại
  const existing = await Category.findById(categoryId)
  if (!existing) {
    throw { status: 404, message: 'Category không tồn tại' }
  }

  // Kiểm tra isSystem
  if (existing.isSystem) {
    throw { status: 403, message: 'Đây là dữ liệu quan trọng không thể xóa hoặc chỉnh sửa' }
  }

  // Kiểm tra order đã tồn tại cho user này chưa
  if (updateData.order !== undefined && updateData.order !== null) {
    const existingOrder = await Category.findOne({ order: updateData.order, userId: existing.userId })
    if (existingOrder && existingOrder._id.toString() !== categoryId) {
      throw { status: 409, message: 'Order này đã tồn tại trong danh sách category' }
    }
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  )
  return category
}

// DELETE CATEGORY BY ID
const deleteCategoryById = async (categoryId) => {
  // Kiểm tra category tồn tại
  const existing = await Category.findById(categoryId)
  if (!existing) {
    throw { status: 404, message: 'Category không tồn tại' }
  }

  // Kiểm tra isSystem
  if (existing.isSystem) {
    throw { status: 403, message: 'Đây là dữ liệu quan trọng không thể xóa hoặc chỉnh sửa' }
  }

  await Category.findByIdAndDelete(categoryId)
}

module.exports = { createCategory, getCategoriesByUserId, getCategoryById, updateCategoryById, deleteCategoryById }
