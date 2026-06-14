import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function CalendarView({ records, month, year, onPrevMonth, onNextMonth }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const recordMap = useMemo(() => {
    const map = {}
    records?.forEach(r => {
      const d = new Date(r.date)
      map[d.getDate()] = r.status
    })
    return map
  }, [records])

  const weeks = useMemo(() => {
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    const rows = []
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
    return rows
  }, [daysInMonth, firstDay])

  const today = new Date()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {MONTHS[month]} {year}
        </span>
        <button onClick={onNextMonth} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 py-1">{d}</div>
        ))}
        {weeks.map((week, wi) => week.map((day, di) => {
          if (!day) return <div key={`${wi}-${di}`} />
          const status = recordMap[day]
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          return (
            <div
              key={`${wi}-${di}`}
              className={`text-center text-xs py-1.5 rounded-full transition-colors ${
                status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                status === 'absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              } ${isToday ? 'ring-2 ring-indigo-400' : ''}`}
            >
              {day}
            </div>
          )
        }))}
      </div>
    </div>
  )
}
