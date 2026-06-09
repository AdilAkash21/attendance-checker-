const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const User = require('./models/User')
const Attendance = require('./models/Attendance')

const users = [
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
  { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' },
  { name: 'Diana Prince', email: 'diana@example.com', password: 'password123' },
]

function getDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(0, 0, 0, 0)
  return d
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    await User.deleteMany({})
    await Attendance.deleteMany({})
    console.log('Cleared existing data')

    const createdUsers = await User.create(users)
    console.log(`Created ${createdUsers.length} users:`)
    createdUsers.forEach(u => console.log(`  - ${u.name} (${u.email})`))

    const statuses = ['present', 'absent']
    const reasons = ['', 'Sick leave', 'Personal work', 'Family emergency', 'Doctor appointment']
    const allRecords = []

    for (const user of createdUsers) {
      for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
        const isWeekend = getDate(daysAgo).getDay() === 0 || getDate(daysAgo).getDay() === 6
        if (isWeekend) continue

        const status = Math.random() < 0.8 ? 'present' : 'absent'
        const reason = status === 'absent' ? reasons[Math.floor(Math.random() * reasons.length)] : ''

        allRecords.push({
          user: user._id,
          date: getDate(daysAgo),
          status,
          reason,
        })
      }
    }

    const createdRecords = await Attendance.insertMany(allRecords)
    console.log(`Created ${createdRecords.length} attendance records`)

    console.log('\n--- Seed Summary ---')
    for (const user of createdUsers) {
      const present = createdRecords.filter(r => r.user.equals(user._id) && r.status === 'present').length
      const absent = createdRecords.filter(r => r.user.equals(user._id) && r.status === 'absent').length
      console.log(`${user.name}: ${present} present, ${absent} absent`)
    }

    console.log('\nSeed complete!')
  } catch (err) {
    console.error('Seed error:', err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seed()
