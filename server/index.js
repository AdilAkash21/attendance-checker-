const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const authRoutes = require('./routes/auth')
const attendanceRoutes = require('./routes/attendance')
const subjectRoutes = require('./routes/subjects')
const qrcodeRoutes = require('./routes/qrcode')

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }))
app.use(express.json({ limit: '10kb' }))
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts, try again later' },
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/qrcode', qrcodeRoutes)

const clientDir = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDir))
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' })
  res.sendFile(path.join(clientDir, 'index.html'))
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on('SIGTERM', () => { console.log('SIGTERM received, shutting down...'); server.close(() => mongoose.disconnect()) })
process.on('SIGINT', () => { console.log('SIGINT received, shutting down...'); server.close(() => mongoose.disconnect()) })
