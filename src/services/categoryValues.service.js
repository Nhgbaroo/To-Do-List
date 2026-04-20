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

  // Kiểm tra order đã tồn tại trong category này chưa
  if (order !== undefined && order !== null) {
    const existingOrder = await CategoryValue.findOne({ order, categoryId })
    if (existingOrder) {
      throw { status: 409, message: 'Order này đã tồn tại trong category' }
    }
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

// GET CATEGORY VALUES BY CATEGORY ID
const getCategoryValuesByCategoryId = async ({ categoryId, userId }) => {
  // Kiểm tra category cha tồn tại và thuộc về user
  const category = await Category.findOne({ _id: categoryId, userId })
  if (!category) {
    throw { status: 404, message: 'Category không tồn tại' }
  }
  const categoryValues = await CategoryValue.find({ categoryId }).sort({ order: 1 })

  return categoryValues
}

// GET ALL CATEGORY VALUES BY USER ID
const getAllCategoryValuesByUserId = async ({ userId }) => {
  const categoryValues = await CategoryValue.find({ userId }).sort({ order: 1 })

  return categoryValues
}

// GET CATEGORY VALUE BY ID
const getCategoryValueById = async ({ categoryValueId, userId }) => {
  const categoryValue = await CategoryValue.findOne({ _id: categoryValueId, userId })
  if (!categoryValue) {
    throw { status: 404, message: 'Category value không tồn tại' }
  }

  return categoryValue
}

// UPDATE CATEGORY VALUE BY ID
const updateCategoryValueById = async ({ categoryValueId, name, slug, color, order, isSystem, isDefault, userId }) => {
  // Kiểm tra category value tồn tại và thuộc về user
  const categoryValue = await CategoryValue.findOne({ _id: categoryValueId, userId })
  if (!categoryValue) {
    throw { status: 404, message: 'Category value không tồn tại' }
  }

  // Kiểm tra isSystem
  if (categoryValue.isSystem) {
    throw { status: 403, message: 'Đây là dữ liệu quan trọng không thể xóa hoặc chỉnh sửa' }
  }

  // Kiểm tra slug đã tồn tại trong category này chưa
  const existingValue = await CategoryValue.findOne({ slug, categoryId: categoryValue.categoryId })
  if (existingValue && existingValue._id.toString() !== categoryValueId) {
    throw { status: 409, message: 'CategoryValue với slug này đã tồn tại trong category' }
  }

  // Kiểm tra order đã tồn tại trong category này chưa
  if (order !== undefined && order !== null) {
    const existingOrder = await CategoryValue.findOne({ order, categoryId: categoryValue.categoryId })
    if (existingOrder && existingOrder._id.toString() !== categoryValueId) {
      throw { status: 409, message: 'Order này đã tồn tại trong category' }
    }
  }

  const updatedCategoryValue = await CategoryValue.findByIdAndUpdate(
    categoryValueId,
    { $set: { name, slug, color, order, isSystem, isDefault } },
    { returnDocument: 'after', runValidators: true }
  )

  return updatedCategoryValue
}

// DELETE CATEGORY VALUE BY ID
const deleteCategoryValueById = async ({ categoryValueId, userId }) => {
  // Kiểm tra category value tồn tại và thuộc về user
  const categoryValue = await CategoryValue.findOne({ _id: categoryValueId, userId })
  if (!categoryValue) {
    throw { status: 404, message: 'Category value không tồn tại' }
  }

  // Kiểm tra isSystem
  if (categoryValue.isSystem) {
    throw { status: 403, message: 'Đây là dữ liệu quan trọng không thể xóa hoặc chỉnh sửa' }
  }

  await CategoryValue.findByIdAndDelete(categoryValueId)
}

module.exports = { createCategoryValue, getCategoryValuesByCategoryId, getAllCategoryValuesByUserId, getCategoryValueById, updateCategoryValueById, deleteCategoryValueById }
