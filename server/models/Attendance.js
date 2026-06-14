const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  reason: { type: String, default: '' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
}, { timestamps: true })

attendanceSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
