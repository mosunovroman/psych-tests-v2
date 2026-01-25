import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setResults(JSON.parse(stored))
      } catch {
        setResults([])
      }
    }
  }, [])

  const saveResult = (result: Omit<TestResult, 'id' | 'date'>) => {
    const newResult: TestResult = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString()
    }

    const updated = [newResult, ...results]
    setResults(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return newResult
  }

  const deleteResult = (id: string) => {
    const updated = results.filter(r => r.id !== id)
    setResults(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const clearResults = () => {
    setResults([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const getResultsByTest = (testId: string) => {
    return results.filter(r => r.testId === testId)
  }

  return {
    results,
    saveResult,
    deleteResult,
    clearResults,
    getResultsByTest
  }
}
