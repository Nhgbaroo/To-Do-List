require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

// Import routes
const authRoute = require('./routes/auth.route')

const app = express()

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoute)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ToDo List API is running' })
})

// Start server
const PORT = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
