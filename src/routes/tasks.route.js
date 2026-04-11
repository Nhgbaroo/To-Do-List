const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasks.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createTaskValidation } = require('../validations/task.validation')
const { uploadSingleImage } = require('../middlewares/upload.middleware')

// POST /api/tasks
router.post('/', verifyToken, uploadSingleImage('image'), createTaskValidation, tasksController.createTask)

module.exports = router
