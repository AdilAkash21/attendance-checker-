import { useState, useEffect, useMemo, useCallback } from 'react'
import api from '../api/client'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { RecordSkeleton } from '../components/Skeleton'
import ConfirmDialog from '../components/ConfirmDialog'
import SubjectSelector from '../components/SubjectSelector'
import usePullToRefresh from '../hooks/usePullToRefresh'
import { Search, Calendar, ChevronLeft, ChevronRight, Download, Trash2, Pencil, X, Loader2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
]

export default function AttendanceRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [subject, setSubject] = useState(null)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [editRecord, setEditRecord] = useState(null)
  const [editForm, setEditForm] = useState({ date: '', status: 'present', reason: '', subject: null })
  const [saving, setSaving] = useState(false)

  const fetchRecords = useCallback(async () => {
    const res = await api.get('/attendance/all', { params: subject ? { subject } : {} })
    setRecords(res.data)
  }, [subject])

  useEffect(() => {
    setLoading(true)
    fetchRecords().catch(() => toast.error('Failed to load records')).finally(() => setLoading(false))
  }, [fetchRecords])

  const { refreshing, pullDistance, pullHandlers } = usePullToRefresh(fetchRecords)

  const filtered = useMemo(() => {
    let result = records
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (subject) result = result.filter(r => r.subject?._id === subject)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.reason?.toLowerCase().includes(q) ||
        new Date(r.date).toLocaleDateString().includes(q) ||
        r.subject?.name?.toLowerCase().includes(q)
      )
    }
    if (dateFrom) result = result.filter(r => new Date(r.date) >= new Date(dateFrom))
    if (dateTo) result = result.filter(r => new Date(r.date) <= new Date(dateTo + 'T23:59:59'))
    return result
  }, [records, statusFilter, search, dateFrom, dateTo, subject])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => setPage(1), [statusFilter, search, dateFrom, dateTo, subject])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/attendance/${deleteId}`)
      setRecords(prev => prev.filter(r => r._id !== deleteId))
      toast.success('Record deleted')
    } catch (err) {
      toast.error('Failed to delete record')
    } finally {
      setDeleteId(null)
    }
  }

  const openEdit = (record) => {
    setEditForm({
      date: new Date(record.date).toISOString().split('T')[0],
      status: record.status,
      reason: record.reason || '',
      subject: record.subject?._id || null,
    })
    setEditRecord(record)
  }

  const handleEdit = async () => {
    if (!editRecord) return
    setSaving(true)
    try {
      const { data } = await api.put(`/attendance/${editRecord._id}`, editForm)
      setRecords(prev => prev.map(r => r._id === editRecord._id ? data : r))
      toast.success('Record updated')
      setEditRecord(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update record')
    } finally {
      setSaving(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Date', 'Status', 'Reason', 'Subject']
    const rows = filtered.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.status,
      r.reason || '',
      r.subject?.name || '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance-records.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }

  const handleExportPDF = () => {
    import('jspdf').then(({ default: jsPDF }) =>
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF()
        doc.setFontSize(16)
        doc.text('Attendance Records', 14, 20)
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

        const rows = filtered.map(r => [
          new Date(r.date).toLocaleDateString(),
          r.status,
          r.reason || '-',
          r.subject?.name || '-',
        ])

        doc.autoTable({
          startY: 34,
          head: [['Date', 'Status', 'Reason', 'Subject']],
          body: rows,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [99, 102, 241] },
        })

        doc.save('attendance-records.pdf')
        toast.success('PDF exported')
      })
    ).catch(() => toast.error('Failed to generate PDF'))
  }

  return (
    <div className="px-4 pt-4 pb-4 animate-fadeIn" {...pullHandlers}>
      {(refreshing || pullDistance > 0) && (
        <div className="flex items-center justify-center py-2" style={{ transform: `translateY(${pullDistance}px)` }}>
          <div className={`w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Records</h2>
          {filtered.length > 0 && (
          <div className="flex gap-2">
            <button onClick={handleExportPDF} className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2.5 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              <FileText size={14} /> PDF
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2.5 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              <Download size={14} /> CSV
            </button>
          </div>
        )}
      </div>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search records..."
          className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 shrink-0">
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === f.value
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <SubjectSelector value={subject} onChange={setSubject} allOption />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-200" />
        <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-200" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <RecordSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Calendar} message="No records found" />
      ) : (
        <>
          <div className="space-y-2">
            {paginated.map(record => (
              <div key={record._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                      {record.subject && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {record.subject.name}
                        </span>
                      )}
                    </div>
                    {record.reason && <p className="text-xs text-gray-400 dark:text-gray-500">{record.reason}</p>}
                  </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={record.status} />
                      <button onClick={() => openEdit(record)}
                        className="p-1 text-gray-300 hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(record._id)}
                        className="p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4 pb-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {editRecord && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setEditRecord(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-xs p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Edit Record</h3>
              <button onClick={() => setEditRecord(null)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Date</label>
                <input type="date" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-sm" />
              </div>

              <SubjectSelector value={editForm.subject} onChange={v => setEditForm(f => ({ ...f, subject: v }))} />

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditForm(f => ({ ...f, status: 'present' }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      editForm.status === 'present'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}>Present</button>
                  <button type="button" onClick={() => setEditForm(f => ({ ...f, status: 'absent' }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                      editForm.status === 'absent'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}>Absent</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Reason</label>
                <textarea value={editForm.reason} onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-sm resize-none" rows="2" />
              </div>
            </div>

            <button onClick={handleEdit} disabled={saving}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete record"
        message="This attendance record will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
