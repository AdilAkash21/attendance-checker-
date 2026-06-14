import { CheckCircle, XCircle } from 'lucide-react'

export default function StatusBadge({ status }) {
  const isPresent = status === 'present'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
      isPresent
        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }`}>
      {isPresent ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {status}
    </span>
  )
}
