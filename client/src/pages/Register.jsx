import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import usePasswordStrength from '../hooks/usePasswordStrength'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const { label, color, width } = usePasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      toast.success('Account created')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Attendance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-8 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Sign up</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              placeholder="Name" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              placeholder="Email" required />
            <div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="Password" required />
              {password && (
                <div className="mt-1.5">
                  <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width }} />
                  </div>
                  <p className={`text-[10px] mt-0.5 font-medium ${password.length < 6 ? 'text-red-500' : 'text-gray-400'}`}>
                    {password.length < 6 ? `Minimum 6 characters (${password.length}/6)` : label}
                  </p>
                </div>
              )}
            </div>
            <button type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex items-center justify-center gap-1.5">
              <UserPlus size={16} /> Sign Up
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
