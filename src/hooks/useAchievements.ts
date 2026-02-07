import { useState, useEffect, useCallback } from 'react'
import {
  gamificationService,
  getLocalStats,
  updateLocalStats,
  UserStats,
  Badge,
  RecordTestResult
} from '../services/gamificationService'

interface UseAchievementsReturn {
  stats: UserStats | null
  badges: Badge[]
  loading: boolean
  error: string | null
  recordTest: (testId: string) => Promise<RecordTestResult | null>
  refresh: () => Promise<void>
}

export function useAchievements(): UseAchievementsReturn {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [statsData, badgesData] = await Promise.all([
        gamificationService.getStats(),
        gamificationService.getAllBadges()
      ])
      setStats(statsData)
      setBadges(badgesData)
    } catch (err) {
      // API unavailable, using local stats
      // Fallback to local storage
      const localStats = getLocalStats()
      setStats(localStats)
      setError('Работаем офлайн')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const recordTest = useCallback(async (testId: string): Promise<RecordTestResult | null> => {
    try {
      const result = await gamificationService.recordTestCompletion(testId)
      // Refresh stats after recording
      await fetchStats()
      return result
    } catch (err) {
      // Fallback to local tracking
      const { newBadge } = updateLocalStats(testId)
      const localStats = getLocalStats()
      setStats(localStats)

      return {
        success: true,
        streak: localStats.streak.current,
        totalTests: localStats.testsCompleted,
        newBadges: newBadge ? [newBadge] : []
      }
    }
  }, [fetchStats])

  const refresh = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  return {
    stats,
    badges,
    loading,
    error,
    recordTest,
    refresh
  }
}
