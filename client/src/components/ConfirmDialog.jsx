import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) {
  if (!open) return null

  const confirmColors = variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-indigo-600 hover:bg-indigo-700'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 max-w-xs w-full shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2 rounded-xl text-xs font-medium text-white transition-colors ${confirmColors}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
