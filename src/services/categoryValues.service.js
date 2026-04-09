const CategoryValue = require('../models/categoryValue.model')
const Category = require('../models/categories.model')

// CREATE CATEGORY VALUE
const createCategoryValue = async ({ name, slug, color, order, isSystem, isDefault, categoryId, userId }) => {
  // Kiểm tra category cha tồn tại và thuộc về user
  const category = await Category.findOne({ _id: categoryId, userId })
  if (!category) {
    throw { status: 404, message: 'Category không tồn tại' }
  }

  // Kiểm tra slug đã tồn tại trong category này chưa
  const existingValue = await CategoryValue.findOne({ slug, categoryId })
  if (existingValue) {
    throw { status: 409, message: 'CategoryValue với slug này đã tồn tại trong category' }
  }

  const categoryValue = await CategoryValue.create({
    name,
    slug,
    color,
    order,
    isSystem,
    isDefault,
    categoryId,
    userId
  })

  return categoryValue
}

module.exports = { createCategoryValue }
