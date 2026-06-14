import { useState } from 'react'
import { useSubjects } from '../context/SubjectContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Subjects() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await addSubject(newName.trim())
      toast.success('Subject added')
      setNewName('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject')
    }
  }

  const handleEdit = async (id) => {
    if (!editName.trim()) return
    try {
      await updateSubject(id, editName.trim())
      toast.success('Subject updated')
      setEditingId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subject')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSubject(deleteId)
      toast.success('Subject deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete subject')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="px-4 pt-4 pb-4 animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Subjects</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New subject name..."
          className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      <div className="space-y-1.5">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-8">Loading...</p>
        ) : subjects.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No subjects yet. Add one above.</p>
        ) : (
          subjects.map(s => (
            <div key={s._id} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
              {editingId === s._id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button onClick={() => handleEdit(s._id)} className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{s.name}</span>
                  <button
                    onClick={() => { setEditingId(s._id); setEditName(s.name) }}
                    className="p-1 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(s._id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete subject"
        message="Attendance records for this subject will be uncategorized. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
