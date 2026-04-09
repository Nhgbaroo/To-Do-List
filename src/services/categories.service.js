const Category = require('../models/categories.model')

// CREATE CATEGORY
const createCategory = async ({ name, slug, order, isSystem, userId }) => {
  // Kiểm tra slug đã tồn tại cho user này chưa
  const existingCategory = await Category.findOne({ slug, userId })
  if (existingCategory) {
    throw { status: 409, message: 'Category với slug này đã tồn tại' }
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

module.exports = { createCategory, getCategoriesByUserId, getCategoryById }
