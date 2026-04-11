const createTaskValidation = (req, res, next) => {
    const { title } = req.body

    if (!title) {
        return res.status(400).json({ message: 'Vui lòng nhập tiêu đề task (title)' })
    }

    if (title.length < 2) {
        return res.status(400).json({ message: 'Tiêu đề task phải có ít nhất 2 ký tự' })
    }

    if (req.body.categoryIds) {
        if (typeof req.body.categoryIds === 'string') {
            try {
                req.body.categoryIds = JSON.parse(req.body.categoryIds);
            } catch (error) {
                // It could be a simple single string ID
                req.body.categoryIds = [req.body.categoryIds];
            }
        }
    }

    next()
}

module.exports = { createTaskValidation }
