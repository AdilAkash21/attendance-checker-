import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Avatar } from '../components/Navbar'
import ConfirmDialog from '../components/ConfirmDialog'
import { Save, LogOut, Lock, User, Mail } from 'lucide-react'

export default function Profile() {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', { name, email })
      setUser(data.user)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await api.put('/auth/password', { currentPassword, newPassword })
      toast.success('Password updated')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="px-4 pt-6 pb-4 animate-fadeIn">
      <div className="flex flex-col items-center mb-6">
        <Avatar size="lg" name={user?.name} />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-3">{user?.name}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-3 mb-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"><User size={14} /> Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200" required />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"><Mail size={14} /> Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-200" required />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <button onClick={() => setShowPasswordForm(!showPasswordForm)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4">
        <Lock size={16} /> {showPasswordForm ? 'Cancel' : 'Change Password'}
      </button>

      {showPasswordForm && (
        <form onSubmit={handleUpdatePassword} className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-200" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-200" required minLength={6} />
          </div>
          <button type="submit" disabled={savingPassword}
            className="w-full bg-gray-800 dark:bg-gray-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      <button onClick={() => setShowLogoutConfirm(true)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
        <LogOut size={16} /> Logout
      </button>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}
