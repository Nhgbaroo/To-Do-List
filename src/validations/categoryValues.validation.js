const { generateSlug } = require('../utils/slug')

// CREATE CATEGORY VALUE
const createCategoryValueValidation = (req, res, next) => {
  const { categoryId } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Vui lòng nhập tên category value' })
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Tên phải có ít nhất 2 ký tự' })
  }

  if (!categoryId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp categoryId' })
  }

  // Tự tạo slug nếu client không gửi
  if (!req.body.slug) {
    req.body.slug = generateSlug(name)
  }

  next()
}

// UPDATE CATEGORY VALUE
const updateCategoryValueValidation = (req, res, next) => {
  const { categoryValueId } = req.params
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Vui lòng nhập tên category value' })
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Tên phải có ít nhất 2 ký tự' })
  }

  if (!categoryValueId) {
    return res.status(400).json({ message: 'Vui lòng cung cấp categoryValueId' })
  }

  // Tự tạo slug nếu client không gửi
  if (!req.body.slug) {
    req.body.slug = generateSlug(name)
  }

  next()
}

module.exports = { createCategoryValueValidation, updateCategoryValueValidation }
