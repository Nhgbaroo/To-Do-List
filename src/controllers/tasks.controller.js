const tasksService = require('../services/tasks.service')

// CREATE TASK
const createTask = async (req, res) => {
    try {
        const userId = req.user._id
        const task = await tasksService.createTask(userId, req.body, req.file)
        
        return res.status(201).json({
            message: 'Tạo task thành công',
            task
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Lỗi server'
        })
    }
}

module.exports = { createTask }
