import { useMemo } from 'react'

export default function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', width: '0%' }
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    const levels = [
      { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' },
      { label: 'Fair', color: 'bg-orange-500', text: 'text-orange-500' },
      { label: 'Good', color: 'bg-yellow-500', text: 'text-yellow-500' },
      { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' },
      { label: 'Very strong', color: 'bg-green-600', text: 'text-green-600' },
    ]

    const idx = Math.min(score, 4)
    return { score, label: levels[idx].label, color: levels[idx].color, text: levels[idx].text, width: `${(idx + 1) * 20}%` }
  }, [password])
}
