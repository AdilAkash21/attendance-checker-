import { useState, useEffect } from 'react'
import axios from 'axios'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
]

export default function AttendanceRecords() {
  const [records, setRecords] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('/api/attendance/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRecords(res.data))
  }, [])

  const filtered = filter === 'all' ? records : records.filter(r => r.status === filter)

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Records</h2>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.value
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-12">No records found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(record => (
            <div key={record._id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500">
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  record.status === 'present'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
              {record.reason && (
                <p className="text-xs text-gray-400 mt-1">{record.reason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
