import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { to: '/', label: 'Home', icon: '📊' },
  { to: '/mark-attendance', label: 'Mark', icon: '✅' },
  { to: '/records', label: 'Records', icon: '📋' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <>
      <div className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-sm font-semibold text-gray-800">Attendance</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{user?.name}</span>
          <button
            onClick={logout}
            className="text-xs text-red-500 font-medium px-2 py-1 rounded-md hover:bg-red-50 active:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-50">
        <div className="flex">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.to
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex-1 flex flex-col items-center justify-center h-14 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-lg mb-0.5">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
