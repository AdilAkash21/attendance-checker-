import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, ClipboardCheck, History, User, Settings, QrCode } from 'lucide-react'
import QRGenerateModal from './QRGenerateModal'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/mark-attendance', label: 'Mark', icon: ClipboardCheck },
  { to: '/records', label: 'Records', icon: History },
  { to: '/profile', label: 'Me', icon: User },
]

function Avatar({ size = 'sm', name = '' }) {
  const sizeClasses = size === 'lg' ? 'w-16 h-16 text-lg' : 'w-8 h-8 text-xs'
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || name[0]?.toUpperCase() || '?'
    : '?'

  return (
    <div className={`${sizeClasses} rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  )
}

export default function Navbar({ dark, toggleDark }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showQrModal, setShowQrModal] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-4 h-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Attendance</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
            aria-label="Generate QR Code"
          >
            <QrCode size={18} />
          </button>
          <button
            onClick={() => navigate(location.pathname === '/settings' ? -1 : '/settings')}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>
      {showQrModal && <QRGenerateModal onClose={() => setShowQrModal(false)} />}

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-full sm:max-w-[480px] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.to
            const Icon = tab.icon
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex-1 flex flex-col items-center justify-center h-14 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={20} className="mb-0.5" strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export { Avatar }