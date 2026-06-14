import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { RecordSkeleton } from '../components/Skeleton'
import CalendarView from '../components/CalendarView'
import SubjectSelector from '../components/SubjectSelector'
import usePullToRefresh from '../hooks/usePullToRefresh'
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [weekly, setWeekly] = useState([])
  const [monthly, setMonthly] = useState([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState(null)
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())

  const fetchData = useCallback(async () => {
    try {
      const params = subject ? { subject } : {}
      const [statsRes, recentRes, weeklyRes, monthlyRes] = await Promise.all([
        api.get('/attendance/stats', { params }),
        api.get('/attendance/recent', { params }),
        api.get('/attendance/weekly', { params }),
        api.get('/attendance/monthly', { params }),
      ])
      setStats(statsRes.data)
      setRecent(recentRes.data)
      setWeekly(weeklyRes.data)
      setMonthly(monthlyRes.data)
    } catch {
      toast.error('Failed to load dashboard data')
    }
  }, [subject])

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

    const { refreshing, pullDistance, pullHandlers } = usePullToRefresh(fetchData)

  const chartData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayMap = {}
    weekly.forEach(r => {
      const d = new Date(r.date)
      const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1]
      dayMap[dayName] = r.status === 'present' ? 1 : 0
    })
    return days.map(d => ({ day: d, present: dayMap[d] ?? null }))
  })()

  return (
    <div className="px-4 pt-4 pb-4 animate-fadeIn" {...pullHandlers}>
      {(refreshing || pullDistance > 0) && (
        <div className="flex items-center justify-center py-2" style={{ transform: `translateY(${pullDistance}px)` }}>
          <RefreshCw size={16} className={`text-indigo-500 ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Hi, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Here's your attendance summary</p>
      </div>

      <SubjectSelector value={subject} onChange={setSubject} allOption className="mb-4" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Total" value={stats?.total ?? 0} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" loading={!stats} />
        <StatCard label="Present" value={stats?.present ?? 0} color="text-green-600 dark:text-green-400" bg="bg-green-50 dark:bg-green-900/20" loading={!stats} />
        <StatCard label="Absent" value={stats?.absent ?? 0} color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-900/20" loading={!stats} />
        <StatCard label="Rate" value={stats ? `${stats.percentage}%` : '0%'} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" loading={!stats} />
      </div>

      {!loading && weekly.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 mb-3">
            <TrendingUp size={14} /> This Week
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                formatter={(v) => v === 1 ? 'Present' : v === 0 ? 'Absent' : 'No record'}
              />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 mb-3">
          <Calendar size={14} /> Calendar
        </h3>
        <CalendarView
          records={monthly}
          month={calMonth}
          year={calYear}
          onPrevMonth={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
          onNextMonth={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recent</h3>
          <Link to="/records" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">See all</Link>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <RecordSkeleton key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState icon={Calendar} message="No records yet" />
        ) : (
          <div className="space-y-2">
            {recent.map(record => (
              <div key={record._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {record.subject && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-2">{record.subject.name}</span>
                  )}
                </div>
                <StatusBadge status={record.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
