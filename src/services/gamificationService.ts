// Gamification API service
const API_BASE = '/api/gamification.php'

// Get or create device ID for user identification
function getDeviceId(): string {
  let deviceId = localStorage.getItem('mindpro_device_id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('mindpro_device_id', deviceId)
  }
  return deviceId
}

export interface Badge {
  code: string
  name: string
  description: string
  icon: string
  threshold?: number
  category?: string
  earned: boolean | number
  earned_at?: string
}

export interface UserStats {
  streak: {
    current: number
    longest: number
    lastActivity: string | null
  }
  testsCompleted: number
  badgesEarned: number
  recentBadges: Badge[]
}

export interface RecordTestResult {
  success: boolean
  streak: number
  totalTests: number
  newBadges: Badge[]
}

class GamificationService {
  private async request<T>(action: string, data?: Record<string, unknown>): Promise<T> {
    const deviceId = getDeviceId()

    try {
      const response = await fetch(`${API_BASE}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, ...data })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Gamification API error:', error)
      throw error
    }
  }

  async getStats(): Promise<UserStats> {
    return this.request<UserStats>('get_stats')
  }

  async recordTestCompletion(testId: string): Promise<RecordTestResult> {
    return this.request<RecordTestResult>('record_test', { testId })
  }

  async getAllBadges(): Promise<Badge[]> {
    return this.request<Badge[]>('get_badges')
  }
}

export const gamificationService = new GamificationService()

// Local fallback when offline or API unavailable
export function getLocalStats(): UserStats {
  const stored = localStorage.getItem('mindpro_local_stats')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid data
    }
  }
  return {
    streak: { current: 0, longest: 0, lastActivity: null },
    testsCompleted: 0,
    badgesEarned: 0,
    recentBadges: []
  }
}

export function updateLocalStats(_testId: string): { newBadge?: Badge } {
  const stats = getLocalStats()
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Update streak
  if (stats.streak.lastActivity === today) {
    // Already active today
  } else if (stats.streak.lastActivity === yesterday) {
    stats.streak.current++
  } else {
    stats.streak.current = 1
  }
  stats.streak.lastActivity = today
  stats.streak.longest = Math.max(stats.streak.longest, stats.streak.current)

  // Update tests count
  stats.testsCompleted++

  // Check for badges
  let newBadge: Badge | undefined
  const testBadges = [
    { threshold: 1, code: 'first_test', name: 'Первый шаг', icon: '🎯', description: 'Пройден первый тест' },
    { threshold: 5, code: 'tests_5', name: 'Исследователь', icon: '🔍', description: 'Пройдено 5 тестов' },
    { threshold: 10, code: 'tests_10', name: 'Знаток себя', icon: '🧠', description: 'Пройдено 10 тестов' },
    { threshold: 25, code: 'tests_25', name: 'Эксперт', icon: '🏆', description: 'Пройдено 25 тестов' },
    { threshold: 50, code: 'tests_50', name: 'Мастер', icon: '👑', description: 'Пройдено 50 тестов' }
  ]

  const streakBadges = [
    { threshold: 3, code: 'streak_3', name: 'Постоянство', icon: '🔥', description: '3 дня подряд' },
    { threshold: 7, code: 'streak_7', name: 'Неделя силы', icon: '💪', description: '7 дней подряд' },
    { threshold: 14, code: 'streak_14', name: 'Две недели', icon: '⭐', description: '14 дней подряд' },
    { threshold: 30, code: 'streak_30', name: 'Месяц заботы', icon: '🌟', description: '30 дней подряд' }
  ]

  const earnedCodes = stats.recentBadges.map(b => b.code)

  // Check test badges
  for (const badge of testBadges) {
    if (stats.testsCompleted >= badge.threshold && !earnedCodes.includes(badge.code)) {
      newBadge = { ...badge, earned: true }
      stats.recentBadges.unshift(newBadge)
      stats.badgesEarned++
      break
    }
  }

  // Check streak badges
  if (!newBadge) {
    for (const badge of streakBadges) {
      if (stats.streak.current >= badge.threshold && !earnedCodes.includes(badge.code)) {
        newBadge = { ...badge, earned: true }
        stats.recentBadges.unshift(newBadge)
        stats.badgesEarned++
        break
      }
    }
  }

  // Keep only recent 10 badges
  stats.recentBadges = stats.recentBadges.slice(0, 10)

  localStorage.setItem('mindpro_local_stats', JSON.stringify(stats))

  return { newBadge }
}
