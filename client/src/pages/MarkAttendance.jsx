import { useState } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Calendar, QrCode } from 'lucide-react'
import SubjectSelector from '../components/SubjectSelector'
import QRScanner from '../components/QRScanner'

export default function MarkAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('present')
  const [reason, setReason] = useState('')
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/attendance/mark', { date, status, reason, subject })
      toast.success('Attendance marked!')
      setStatus('present')
      setReason('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = (decodedText) => {
    setShowScanner(false)
    try {
      const data = JSON.parse(decodedText)
      if (data.date) setDate(data.date)
      if (data.status) setStatus(data.status)
      if (data.subject) setSubject(data.subject)
      toast.success('QR code scanned')
    } catch {
      toast.error('Invalid QR code format')
    }
  }

  return (
    <div className="px-4 pt-4 pb-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Mark Attendance</h2>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2.5 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
          <QrCode size={14} /> Scan
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
            <Calendar size={14} /> Date
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200" required />
        </div>

        <SubjectSelector value={subject} onChange={setSubject} />

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStatus('present')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                status === 'present'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}>
              <CheckCircle size={16} /> Present
            </button>
            <button type="button" onClick={() => setStatus('absent')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                status === 'absent'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}>
              <XCircle size={16} /> Absent
            </button>
          </div>
        </div>

        {status === 'absent' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 resize-none"
              rows="3" placeholder="Optional reason..." />
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
          {loading ? 'Saving...' : 'Mark Attendance'}
        </button>
      </form>

      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
    </div>
  )
}
