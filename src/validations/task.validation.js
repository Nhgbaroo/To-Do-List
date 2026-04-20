// Parse categoryIds từ string (form-data) sang array nếu cần
const parseCategoryIds = (req) => {
  if (req.body.categoryIds && typeof req.body.categoryIds === 'string') {
    try {
      req.body.categoryIds = JSON.parse(req.body.categoryIds)
    } catch {
      req.body.categoryIds = [req.body.categoryIds]
    }
  }
}

const validateTitle = (title, res) => {
  if (!title) {
    res.status(400).json({ message: 'Vui lòng nhập tiêu đề task (title)' })
    return false
  }
  if (title.length < 2) {
    res.status(400).json({ message: 'Tiêu đề task phải có ít nhất 2 ký tự' })
    return false
  }
  return true
}

// CREATE TASK
const createTaskValidation = (req, res, next) => {
  if (!validateTitle(req.body.title, res)) return
  parseCategoryIds(req)
  next()
}

// UPDATE TASK
const updateTaskValidation = (req, res, next) => {
  if (!validateTitle(req.body.title, res)) return
  parseCategoryIds(req)
  next()
}

module.exports = { createTaskValidation, updateTaskValidation }
