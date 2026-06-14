const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

subjectSchema.index({ user: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Subject', subjectSchema)
