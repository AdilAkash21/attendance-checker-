import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Attendance</h2>
        <div className="bg-white rounded-2xl px-6 py-8 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Sign in</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
            >
              Sign In
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
