const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasks.controller')
const { verifyToken } = require('../middlewares/auth.middleware')
const { createTaskValidation, updateTaskValidation } = require('../validations/task.validation')
const { uploadSingleImage } = require('../middlewares/upload.middleware')

// QUAN TRỌNG: Các route cụ thể (không có :param) phải đặt TRƯỚC route động (/:id)
// để Express không nhầm "vital" hay "status" thành một taskId

// POST /api/tasks
router.post('/', verifyToken, uploadSingleImage('image'), createTaskValidation, tasksController.createTask)

// GET /api/tasks
router.get('/', verifyToken, tasksController.getAllTasks)

// GET /api/tasks/vital  <-- phải đặt trước /:id
router.get('/vital', verifyToken, tasksController.getVitalTasks)

// GET /api/tasks/status/:status  <-- phải đặt trước /:id
router.get('/status/:status', verifyToken, tasksController.getTasksByStatus)

// GET /api/tasks/:id
router.get('/:id', verifyToken, tasksController.getTaskById)

// PUT /api/tasks/:id
router.put('/:id', verifyToken, uploadSingleImage('image'), updateTaskValidation, tasksController.updateTask)

// DELETE /api/tasks/:id
router.delete('/:id', verifyToken, tasksController.deleteTask)

module.exports = router
