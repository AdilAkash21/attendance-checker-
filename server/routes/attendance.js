const express = require('express')
const Attendance = require('../models/Attendance')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/mark', auth, async (req, res) => {
  try {
    const { date, status, reason } = req.body
    const recordDate = new Date(date)
    recordDate.setHours(0, 0, 0, 0)

    const existing = await Attendance.findOne({ user: req.user._id, date: recordDate })
    if (existing) return res.status(400).json({ message: 'Attendance already marked for this date' })

    const attendance = new Attendance({ user: req.user._id, date: recordDate, status, reason })
    await attendance.save()
    res.status(201).json(attendance)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/stats', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
    const total = records.length
    const present = records.filter(r => r.status === 'present').length
    const absent = records.filter(r => r.status === 'absent').length
    const percentage = total ? Math.round((present / total) * 100) : 0
    res.json({ total, present, absent, percentage })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/recent', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5)
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/all', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
