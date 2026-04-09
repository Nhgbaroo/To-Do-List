// CREATE CATEGORY
const createCategoryValidation = (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Vui lòng nhập tên category' })
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Tên category phải có ít nhất 2 ký tự' })
  }

  // Tự tạo slug từ name
  if (!req.body.slug) {
    req.body.slug = name.toLowerCase()
  }
  next()
}

module.exports = { createCategoryValidation }
