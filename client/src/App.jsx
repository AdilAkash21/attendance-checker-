import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MarkAttendance from './pages/MarkAttendance'
import AttendanceRecords from './pages/AttendanceRecords'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" /></div>
  return user ? children : <Navigate to="/login" />
}

function PageLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto pb-14">
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000, style: { fontSize: '14px', padding: '8px 16px' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><PageLayout><Dashboard /></PageLayout></ProtectedRoute>} />
        <Route path="/mark-attendance" element={<ProtectedRoute><PageLayout><MarkAttendance /></PageLayout></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><PageLayout><AttendanceRecords /></PageLayout></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
