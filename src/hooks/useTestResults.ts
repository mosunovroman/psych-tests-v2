import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { syncService } from '../services/syncService'

export interface TestResult {
  id: string
  testId: string
  testName: string
  score: number
  maxScore: number
  level: 'minimal' | 'mild' | 'moderate' | 'severe'
  title: string
  date: string
}

const STORAGE_KEY = 'psych-tests-results'

export function useTestResults() {
  const [results, setResults] = useState<TestResult[]>([])
  const [syncing, setSyncing] = useState(false)
  const { user } = useAuth()

  // Load results on mount and when user changes
  useEffect(() => {
    const loadResults = async () => {
      if (user) {
        // If logged in, sync from cloud
        setSyncing(true)
        try {
          const cloudResults = await syncService.syncFromCloud(user.id)
          setResults(cloudResults)
        } finally {
          setSyncing(false)
        }
      } else {
        // If not logged in, load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            setResults(JSON.parse(stored))
          } catch {
            setResults([])
          }
        }
      }
    }

    loadResults()
  }, [user])

  // Migrate local data when user logs in
  useEffect(() => {
    if (user) {
      syncService.migrateLocalData(user.id)
    }
  }, [user])

  const saveResult = useCallback(async (result: Omit<TestResult, 'id' | 'date'>) => {
    const newResult: TestResult = {
      ...result,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      date: new Date().toISOString()
    }

    // Save locally first
    await syncService.saveLocalResult(newResult)
    setResults(prev => [newResult, ...prev])

    // If logged in, sync to cloud
    if (user) {
      await syncService.syncToCloud(user.id)
      syncService.updateLastSync()
    }

    return newResult
  }, [user])

  const deleteResult = useCallback((id: string) => {
    const updated = results.filter(r => r.id !== id)
    setResults(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [results])

  const clearResults = useCallback(() => {
    setResults([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getResultsByTest = useCallback((testId: string) => {
    return results.filter(r => r.testId === testId)
  }, [results])

  const syncNow = useCallback(async () => {
    if (!user) return { success: false, error: 'Not logged in' }

    setSyncing(true)
    try {
      const result = await syncService.syncToCloud(user.id)
      if (result.success) {
        const cloudResults = await syncService.syncFromCloud(user.id)
        setResults(cloudResults)
        syncService.updateLastSync()
      }
      return result
    } finally {
      setSyncing(false)
    }
  }, [user])

  return {
    results,
    saveResult,
    deleteResult,
    clearResults,
    getResultsByTest,
    syncing,
    syncNow,
    syncStatus: syncService.getSyncStatus()
  }
}
