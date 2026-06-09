import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Attendance</h2>
        <div className="bg-white rounded-2xl px-6 py-8 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Sign up</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder="Name"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
