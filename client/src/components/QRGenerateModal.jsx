import { useState, useRef } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'
import { X, Download, Loader2, QrCode, Calendar, CheckCircle, XCircle } from 'lucide-react'
import SubjectSelector from './SubjectSelector'

export default function QRGenerateModal({ onClose }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('present')
  const [subject, setSubject] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [generating, setGenerating] = useState(false)
  const downloadRef = useRef(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setQrDataUrl(null)
    try {
      const payload = { date, status }
      if (subject) payload.subject = subject
      const { data } = await api.post('/qrcode/generate', payload)
      setQrDataUrl(data.qr)
    } catch {
      toast.error('Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl || !downloadRef.current) return
    downloadRef.current.href = qrDataUrl
    downloadRef.current.download = `attendance-qr-${date}.png`
    downloadRef.current.click()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-xs p-6 flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <QrCode size={16} /> Generate QR
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="w-full space-y-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Calendar size={13} /> Date
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-sm" />
          </div>

          <SubjectSelector value={subject} onChange={setSubject} />

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStatus('present')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  status === 'present'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}>
                <CheckCircle size={14} /> Present
              </button>
              <button type="button" onClick={() => setStatus('absent')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                  status === 'absent'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}>
                <XCircle size={14} /> Absent
              </button>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
            {generating ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
            {generating ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {qrDataUrl && (
          <div className="flex flex-col items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700 w-full">
            <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 rounded-lg" />
            <div className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
              <p>Date: {date}</p>
              <p>Status: {status}</p>
              {subject && <p>Subject ID: {subject}</p>}
            </div>
            <button onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
              <Download size={14} /> Download PNG
            </button>
            <a ref={downloadRef} className="hidden" />
          </div>
        )}
      </div>
    </div>
  )
}
