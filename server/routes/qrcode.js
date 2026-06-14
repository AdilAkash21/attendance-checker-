const express = require('express')
const QRCode = require('qrcode')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/generate', auth, async (req, res) => {
  try {
    const { subject, status, date } = req.body
    const payload = {}
    if (subject) payload.subject = subject
    if (status) payload.status = status
    if (date) payload.date = date

    const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
      width: 400,
      margin: 2,
      color: { dark: '#1e1e2f', light: '#ffffff' },
    })
    res.json({ qr: dataUrl })
  } catch (err) {
    console.error('QR generate error:', err)
    res.status(500).json({ message: 'Failed to generate QR code' })
  }
})

module.exports = router
