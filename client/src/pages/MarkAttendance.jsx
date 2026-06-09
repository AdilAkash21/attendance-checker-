import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function MarkAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('present')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/attendance/mark', { date, status, reason }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Attendance marked!')
      setStatus('present')
      setReason('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus('present')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                status === 'present'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Present
            </button>
            <button
              type="button"
              onClick={() => setStatus('absent')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                status === 'absent'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              Absent
            </button>
          </div>
        </div>

        {status === 'absent' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
              rows="3"
              placeholder="Optional reason..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  )
}
