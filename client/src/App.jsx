import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import useDarkMode from './hooks/useDarkMode'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MarkAttendance from './pages/MarkAttendance'
import AttendanceRecords from './pages/AttendanceRecords'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Subjects from './pages/Subjects'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import { Skeleton } from './components/Skeleton'
import { SubjectProvider } from './context/SubjectContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }
  return user ? children : <Navigate to="/login" />
}

function PageLayout({ children, dark, toggleDark }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-white dark:bg-gray-900">
      <Navbar dark={dark} toggleDark={toggleDark} />
      <main className="flex-1 overflow-y-auto pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  )
}

function App() {
  const [dark, toggleDark] = useDarkMode()

  return (
    <AuthProvider>
      <SubjectProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000, style: { fontSize: '14px', padding: '8px 16px' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><Dashboard /></PageLayout></ProtectedRoute>} />
        <Route path="/mark-attendance" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><MarkAttendance /></PageLayout></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><AttendanceRecords /></PageLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><Profile /></PageLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><Settings dark={dark} toggleDark={toggleDark} /></PageLayout></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><PageLayout dark={dark} toggleDark={toggleDark}><Subjects /></PageLayout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </SubjectProvider>
    </AuthProvider>
  )
}

export default App
