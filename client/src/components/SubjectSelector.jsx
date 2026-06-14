import { useSubjects } from '../context/SubjectContext'
import { BookOpen } from 'lucide-react'

export default function SubjectSelector({ value, onChange, allOption = false, className = '' }) {
  const { subjects, loading } = useSubjects()

  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        <BookOpen size={14} /> Subject
      </label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 appearance-none"
      >
        {allOption && <option value="">All Subjects</option>}
        {!allOption && <option value="">No subject</option>}
        {loading ? (
          <option disabled>Loading...</option>
        ) : (
          subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
        )}
      </select>
    </div>
  )
}
