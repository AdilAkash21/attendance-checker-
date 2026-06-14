const express = require('express')
const mongoose = require('mongoose')
const Attendance = require('../models/Attendance')
const auth = require('../middleware/auth')

const router = express.Router()

function parseSubjectFilter(query) {
  if (!query.subject) return {}
  if (!mongoose.Types.ObjectId.isValid(query.subject)) return null
  return { subject: query.subject }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}

router.post('/mark', auth, async (req, res) => {
  try {
    const { date, status, reason, subject } = req.body
    if (!date) return res.status(400).json({ message: 'Date is required' })
    const recordDate = new Date(date)
    recordDate.setHours(0, 0, 0, 0)
    if (!isValidDate(recordDate)) return res.status(400).json({ message: 'Invalid date' })
    if (subject && !mongoose.Types.ObjectId.isValid(subject)) return res.status(400).json({ message: 'Invalid subject ID' })

    const existing = await Attendance.findOne({ user: req.user._id, date: recordDate })
    if (existing) return res.status(400).json({ message: 'Attendance already marked for this date' })

    const attendance = new Attendance({ user: req.user._id, date: recordDate, status, reason, subject })
    await attendance.save()
    const populated = await Attendance.findById(attendance._id).populate('subject', 'name')
    res.status(201).json(populated)
  } catch (err) {
    console.error('Mark attendance error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/stats', auth, async (req, res) => {
  try {
    const subjectFilter = parseSubjectFilter(req.query)
    if (req.query.subject && subjectFilter === null) return res.status(400).json({ message: 'Invalid subject ID' })
    const filter = { user: req.user._id, ...subjectFilter }
    const records = await Attendance.find(filter)
    const total = records.length
    const present = records.filter(r => r.status === 'present').length
    const absent = records.filter(r => r.status === 'absent').length
    const percentage = total ? Math.round((present / total) * 100) : 0
    res.json({ total, present, absent, percentage })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/weekly', auth, async (req, res) => {
  try {
    const subjectFilter = parseSubjectFilter(req.query)
    if (req.query.subject && subjectFilter === null) return res.status(400).json({ message: 'Invalid subject ID' })
    const filter = { user: req.user._id, ...subjectFilter }
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    filter.date = { $gte: startOfWeek, $lte: endOfWeek }
    const records = await Attendance.find(filter).sort({ date: 1 })
    res.json(records)
  } catch (err) {
    console.error('Weekly error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/monthly', auth, async (req, res) => {
  try {
    const subjectFilter = parseSubjectFilter(req.query)
    if (req.query.subject && subjectFilter === null) return res.status(400).json({ message: 'Invalid subject ID' })
    const filter = { user: req.user._id, ...subjectFilter }
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    filter.date = { $gte: startOfMonth, $lte: endOfMonth }
    const records = await Attendance.find(filter).sort({ date: 1 })
    res.json(records)
  } catch (err) {
    console.error('Monthly error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/recent', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5)
      .populate('subject', 'name')
    res.json(records)
  } catch (err) {
    console.error('Recent error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/all', auth, async (req, res) => {
  try {
    const subjectFilter = parseSubjectFilter(req.query)
    if (req.query.subject && subjectFilter === null) return res.status(400).json({ message: 'Invalid subject ID' })
    const filter = { user: req.user._id, ...subjectFilter }
    const records = await Attendance.find(filter).sort({ date: -1 }).populate('subject', 'name')
    res.json(records)
  } catch (err) {
    console.error('All records error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid record ID' })
    const { date, status, reason, subject } = req.body
    const update = {}
    if (date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      if (!isValidDate(d)) return res.status(400).json({ message: 'Invalid date' })
      update.date = d
    }
    if (status) {
      if (!['present', 'absent'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
      update.status = status
    }
    if (reason !== undefined) update.reason = reason
    if (subject !== undefined) {
      if (subject && !mongoose.Types.ObjectId.isValid(subject)) return res.status(400).json({ message: 'Invalid subject ID' })
      update.subject = subject
    }

    const record = await Attendance.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true }
    ).populate('subject', 'name')
    if (!record) return res.status(404).json({ message: 'Record not found' })
    res.json(record)
  } catch (err) {
    console.error('Update attendance error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid record ID' })
    const record = await Attendance.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!record) return res.status(404).json({ message: 'Record not found' })
    res.json({ message: 'Record deleted' })
  } catch (err) {
    console.error('Delete attendance error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
