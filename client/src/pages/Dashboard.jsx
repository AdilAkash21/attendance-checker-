import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, percentage: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    axios.get('/api/attendance/stats', { headers }).then(res => setStats(res.data))
    axios.get('/api/attendance/recent', { headers }).then(res => setRecent(res.data))
  }, [])

  const statCards = [
    { label: 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Present', value: stats.present, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Absent', value: stats.absent, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Rate', value: stats.percentage + '%', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Hi, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-xs text-gray-500">Here's your attendance summary</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {statCards.map(card => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Recent</h3>
          <Link to="/records" className="text-xs text-indigo-600 font-medium">See all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No records yet</p>
        ) : (
          <div className="space-y-2">
            {recent.map(record => (
              <div key={record._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">
                  {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  record.status === 'present'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
