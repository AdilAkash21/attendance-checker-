import { useState, useRef, useCallback } from 'react'

export default function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const pulling = useRef(false)

  const handleTouchStart = useCallback((e) => {
    if (e.currentTarget.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      pulling.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 80))
    }
  }, [])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return
    pulling.current = false
    if (pullDistance > 50) {
      setRefreshing(true)
      try { await onRefresh() } finally { setRefreshing(false) }
    }
    setPullDistance(0)
  }, [pullDistance, onRefresh])

  return {
    refreshing,
    pullDistance,
    pullHandlers: { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd },
  }
}
