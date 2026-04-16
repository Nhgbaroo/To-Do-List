const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasks.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createTaskValidation, updateTaskValidation } = require('../validations/task.validation')
const { uploadSingleImage } = require('../middlewares/upload.middleware')

// POST /api/tasks
router.post('/', verifyToken, uploadSingleImage('image'), createTaskValidation, tasksController.createTask)

// PUT /api/tasks/:id
router.put('/:id', verifyToken, uploadSingleImage('image'), updateTaskValidation, tasksController.updateTask)

// GET /api/tasks
router.get('/', verifyToken, tasksController.getAllTasks)

// GET /api/tasks/status/:status
router.get('/status/:status', verifyToken, tasksController.getTasksByStatus)

// GET /api/tasks/vital
router.get('/vital', verifyToken, tasksController.getVitalTasks)

module.exports = router
