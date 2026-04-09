// Tạo slug: bỏ dấu tiếng Việt, thay khoảng trắng bằng dấu -
const generateSlug = (text) => {
  return text
    .toLowerCase()                      // chuyển sang chữ thường
    .normalize('NFD')                   // tách dấu ra khỏi chữ: ă → ă
    .replace(/[\u0300-\u036f]/g, '')    // xoá dấu: ă → a
    .replace(/đ/g, 'd')                 // đ → d
    .replace(/Đ/g, 'D')                 // Đ → D
    .replace(/[^a-z0-9\s-]/g, '')       // xoá ký tự đặc biệt
    .replace(/\s+/g, '-')               // khoảng trắng → dấu -
    .replace(/-+/g, '-')                // nhiều dấu - liên tiếp → 1 dấu -
    .replace(/^-|-$/g, '')              // bỏ dấu - ở đầu/cuối
}

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
