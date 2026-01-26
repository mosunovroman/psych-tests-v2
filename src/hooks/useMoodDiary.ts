import { useState, useEffect, useCallback } from 'react'

export interface MoodEntry {
  id: string
  date: string
  mood: number // 1-5
  energy: number // 1-5
  anxiety: number // 1-5
  note: string
  activities: string[]
}

const STORAGE_KEY = 'psych-tests-mood-diary'

const defaultActivities = [
  'Работа', 'Спорт', 'Прогулка', 'Общение', 'Хобби',
  'Отдых', 'Медитация', 'Сон', 'Еда', 'Алкоголь'
]

export function useMoodDiary() {
  const [entries, setEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setEntries(JSON.parse(stored))
      } catch {
        setEntries([])
      }
    }
  }, [])

  const saveEntry = useCallback((entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    }

    setEntries(prev => {
      const updated = [newEntry, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return newEntry
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAllEntries = useCallback(() => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getEntriesByDateRange = useCallback((start: Date, end: Date) => {
    return entries.filter(e => {
      const date = new Date(e.date)
      return date >= start && date <= end
    })
  }, [entries])

  const getTodayEntry = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return entries.find(e => e.date.startsWith(today))
  }, [entries])

  const getAverages = useCallback((days: number = 7) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const recentEntries = entries.filter(e => new Date(e.date) >= cutoff)

    if (recentEntries.length === 0) return null

    const sum = recentEntries.reduce((acc, e) => ({
      mood: acc.mood + e.mood,
      energy: acc.energy + e.energy,
      anxiety: acc.anxiety + e.anxiety
    }), { mood: 0, energy: 0, anxiety: 0 })

    return {
      mood: sum.mood / recentEntries.length,
      energy: sum.energy / recentEntries.length,
      anxiety: sum.anxiety / recentEntries.length,
      count: recentEntries.length
    }
  }, [entries])

  return {
    entries,
    saveEntry,
    deleteEntry,
    clearAllEntries,
    getEntriesByDateRange,
    getTodayEntry,
    getAverages,
    defaultActivities
  }
}
