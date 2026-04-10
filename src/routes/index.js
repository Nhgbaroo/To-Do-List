const express = require('express')
const router = express.Router()

const authRoute = require('./auth.route')
const categoryRoute = require('./categories.route')
const categoryValueRoute = require('./categoryValues.route')

// Routes
router.use('/api/auth', authRoute)
router.use('/api/categories', categoryRoute)
router.use('/api/category-values', categoryValueRoute)

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'ToDo List API is running' })
})

module.exports = router
