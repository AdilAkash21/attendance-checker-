import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm text-center">
        <FileQuestion className="w-16 h-16 text-white/80 mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-white mb-2">404</h2>
        <p className="text-white/70 text-sm mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
