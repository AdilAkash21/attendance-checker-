import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/client'
import toast from 'react-hot-toast'

const SubjectContext = createContext()

export function useSubjects() {
  return useContext(SubjectContext)
}

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubjects = useCallback(() => {
    api.get('/subjects')
      .then(res => setSubjects(res.data))
      .catch(() => toast.error('Failed to load subjects'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchSubjects() }, [fetchSubjects])

  const addSubject = async (name) => {
    const res = await api.post('/subjects', { name })
    setSubjects(prev => [...prev, res.data])
    return res.data
  }

  const updateSubject = async (id, name) => {
    const res = await api.put(`/subjects/${id}`, { name })
    setSubjects(prev => prev.map(s => s._id === id ? res.data : s))
    return res.data
  }

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`)
    setSubjects(prev => prev.filter(s => s._id !== id))
  }

  return (
    <SubjectContext.Provider value={{ subjects, loading, fetchSubjects, addSubject, updateSubject, deleteSubject }}>
      {children}
    </SubjectContext.Provider>
  )
}
