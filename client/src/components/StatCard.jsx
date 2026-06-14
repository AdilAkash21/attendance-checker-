import { Skeleton } from './Skeleton'

export default function StatCard({ label, value, color, bg, loading }) {
  if (loading) {
    return (
      <div className={`${bg || 'bg-gray-50 dark:bg-gray-800'} rounded-xl p-4`}>
        <Skeleton className="h-3 w-12 mb-2" />
        <Skeleton className="h-7 w-16" />
      </div>
    )
  }
  return (
    <div className={`${bg || 'bg-gray-50 dark:bg-gray-800'} rounded-xl p-4`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
