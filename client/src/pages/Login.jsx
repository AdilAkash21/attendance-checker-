import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      toast.success('Logged in')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Attendance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-8 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Sign in</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn size={16} /> Sign In
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
