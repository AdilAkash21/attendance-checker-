import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, message = 'No data found', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" strokeWidth={1.5} />
      <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
      {action && (
        <button onClick={action.onClick} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700">
          {action.label}
        </button>
      )}
    </div>
  )
}
