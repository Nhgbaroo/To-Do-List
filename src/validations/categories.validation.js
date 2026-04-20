const { generateSlug } = require('../utils/slug')

// CREATE CATEGORY
const createCategoryValidation = (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Vui lòng nhập tên category' })
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Tên category phải có ít nhất 2 ký tự' })
  }

  // Tự tạo slug từ name nếu client không gửi
  if (!req.body.slug) {
    req.body.slug = generateSlug(name)
  }

  next()
}

// UPDATE CATEGORY
const updateCategoryValidation = (req, res, next) => {
  const { name } = req.body

  if (name && name.length < 2) {
    return res.status(400).json({ message: 'Tên category phải có ít nhất 2 ký tự' })
  }

  // Tự tạo slug nếu name thay đổi
  if (name && !req.body.slug) {
    req.body.slug = generateSlug(name)
  }

  next()
}

module.exports = { createCategoryValidation, updateCategoryValidation }
