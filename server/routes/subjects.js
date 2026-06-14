const express = require('express')
const mongoose = require('mongoose')
const Subject = require('../models/Subject')
const Attendance = require('../models/Attendance')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ name: 1 })
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ message: 'Subject name is required' })
    const existing = await Subject.findOne({ user: req.user._id, name: name.trim() })
    if (existing) return res.status(400).json({ message: 'Subject already exists' })
    const subject = new Subject({ name: name.trim(), user: req.user._id })
    await subject.save()
    res.status(201).json(subject)
  } catch (err) {
    console.error('Create subject error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid subject ID' })
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id })
    if (!subject) return res.status(404).json({ message: 'Subject not found' })
    subject.name = req.body.name?.trim() || subject.name
    await subject.save()
    res.json(subject)
  } catch (err) {
    console.error('Update subject error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid subject ID' })
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!subject) return res.status(404).json({ message: 'Subject not found' })
    await Attendance.updateMany({ subject: req.params.id }, { $set: { subject: null } })
    res.json({ message: 'Subject deleted' })
  } catch (err) {
    console.error('Delete subject error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
