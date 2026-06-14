const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' })
    if (!email || !email.trim()) return res.status(400).json({ message: 'Email is required' })
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const user = new User({ name: name.trim(), email: normalizedEmail, password })
    await user.save()

    const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail }).select('+password')
    if (!user) return res.status(400).json({ message: 'Invalid email or password' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' })

    const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user })
})

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name && !email) return res.status(400).json({ message: 'Nothing to update' })
    if (email) {
      const normalizedEmail = email.trim().toLowerCase()
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } })
      if (existing) return res.status(400).json({ message: 'Email already in use' })
      req.user.email = normalizedEmail
    }
    if (name && name.trim()) req.user.name = name.trim()
    await req.user.save()
    res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords are required' })
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' })
    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' })
    user.password = newPassword
    user.tokenVersion += 1
    await user.save()
    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
