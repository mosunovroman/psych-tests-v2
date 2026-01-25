import { supabase } from '../lib/supabase'
import { TestResult } from '../hooks/useTestResults'

const RESULTS_KEY = 'psych-tests-results'
const SYNC_PENDING_KEY = 'psych-tests-sync-pending'

interface SyncStatus {
  syncing: boolean
  lastSync: string | null
  pendingCount: number
}

class SyncService {
  private syncing = false

  async getLocalResults(): Promise<TestResult[]> {
    try {
      const stored = localStorage.getItem(RESULTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  async saveLocalResult(result: TestResult): Promise<void> {
    const results = await this.getLocalResults()
    const updated = [result, ...results]
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated))

    // Add to pending sync queue
    this.addToPendingSync(result)
  }

  private addToPendingSync(result: TestResult): void {
    try {
      const pending = localStorage.getItem(SYNC_PENDING_KEY)
      const queue = pending ? JSON.parse(pending) : []
      queue.push(result)
      localStorage.setItem(SYNC_PENDING_KEY, JSON.stringify(queue))
    } catch {
      // ignore
    }
  }

  private clearPendingSync(): void {
    localStorage.removeItem(SYNC_PENDING_KEY)
  }

  async syncToCloud(userId: string): Promise<{ success: boolean; error?: string }> {
    if (this.syncing) return { success: false, error: 'Sync in progress' }

    this.syncing = true

    try {
      // Get pending items
      const pending = localStorage.getItem(SYNC_PENDING_KEY)
      const pendingResults: TestResult[] = pending ? JSON.parse(pending) : []

      if (pendingResults.length === 0) {
        this.syncing = false
        return { success: true }
      }

      // Upload to Supabase
      const { error } = await supabase
        .from('test_results')
        .upsert(
          pendingResults.map(r => ({
            id: r.id,
            user_id: userId,
            test_id: r.testId,
            test_name: r.testName,
            score: r.score,
            max_score: r.maxScore,
            level: r.level,
            title: r.title,
            created_at: r.date
          })),
          { onConflict: 'id' }
        )

      if (error) throw error

      // Clear pending queue
      this.clearPendingSync()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      this.syncing = false
    }
  }

  async syncFromCloud(userId: string): Promise<TestResult[]> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const results: TestResult[] = (data || []).map(row => ({
        id: row.id,
        testId: row.test_id,
        testName: row.test_name,
        score: row.score,
        maxScore: row.max_score,
        level: row.level as TestResult['level'],
        title: row.title,
        date: row.created_at
      }))

      // Merge with local results
      const localResults = await this.getLocalResults()
      const merged = this.mergeResults(localResults, results)

      // Save merged results locally
      localStorage.setItem(RESULTS_KEY, JSON.stringify(merged))

      return merged
    } catch (error) {
      console.error('Sync from cloud failed:', error)
      return this.getLocalResults()
    }
  }

  private mergeResults(local: TestResult[], cloud: TestResult[]): TestResult[] {
    const map = new Map<string, TestResult>()

    // Add cloud results first
    cloud.forEach(r => map.set(r.id, r))

    // Add local results (may override if newer)
    local.forEach(r => {
      const existing = map.get(r.id)
      if (!existing || new Date(r.date) > new Date(existing.date)) {
        map.set(r.id, r)
      }
    })

    // Sort by date descending
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  async migrateLocalData(userId: string): Promise<void> {
    const localResults = await this.getLocalResults()

    if (localResults.length === 0) return

    // Add all local results to pending sync
    localResults.forEach(r => this.addToPendingSync(r))

    // Sync to cloud
    await this.syncToCloud(userId)
  }

  getSyncStatus(): SyncStatus {
    const pending = localStorage.getItem(SYNC_PENDING_KEY)
    const pendingQueue = pending ? JSON.parse(pending) : []

    return {
      syncing: this.syncing,
      lastSync: localStorage.getItem('psych-tests-last-sync'),
      pendingCount: pendingQueue.length
    }
  }

  updateLastSync(): void {
    localStorage.setItem('psych-tests-last-sync', new Date().toISOString())
  }
}

export const syncService = new SyncService()
