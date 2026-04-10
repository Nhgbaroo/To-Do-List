const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Import routes
const routes = require('./routes')

const app = express()

// Middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', routes)

module.exports = app
