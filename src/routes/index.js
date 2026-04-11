const express = require('express')
const router = express.Router()

const authRoute = require('./auth.route')
const userRoute = require('./users.route')
const categoryRoute = require('./categories.route')
const categoryValueRoute = require('./categoryValues.route')
const tasksRoute = require('./tasks.route')

// Routes
router.use('/api/auth', authRoute)
router.use('/api/users', userRoute)
router.use('/api/categories', categoryRoute)
router.use('/api/category-values', categoryValueRoute)
router.use('/api/tasks', tasksRoute)

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'ToDo List API is running' })
})

module.exports = router
