import { Sun, Moon, Info, Smartphone } from 'lucide-react'

export default function Settings({ dark, toggleDark }) {
  return (
    <div className="px-4 pt-4 pb-4 animate-fadeIn">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Settings</h2>

      <div className="space-y-3">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Appearance</h3>
          <button
            onClick={toggleDark}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              {dark ? <Moon size={18} /> : <Sun size={18} />}
              Dark Mode
            </span>
            <div className={`w-10 h-5 rounded-full transition-colors relative ${dark ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">About</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Info size={16} className="text-gray-400" />
              <span>Attendance Checker</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Smartphone size={16} className="text-gray-400" />
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
