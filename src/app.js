const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Import routes
const authRoute = require('./routes/auth.route')
const categoryRoute = require('./routes/categories.route')

const app = express()

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoute)
app.use('/api/categories', categoryRoute)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ToDo List API is running' })
})

module.exports = app
