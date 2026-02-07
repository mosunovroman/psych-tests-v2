import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTestResults } from '../hooks/useTestResults'
import { useMoodDiary } from '../hooks/useMoodDiary'
import { syncService } from '../services/syncService'
import { useAchievements } from '../hooks/useAchievements'
import StreakCounter from '../components/StreakCounter'
import BadgeList from '../components/BadgeList'

export default function ProfilePage() {
  const { user, signOut, isConfigured } = useAuth()
  const { results, clearResults } = useTestResults()
  const { entries, clearAllEntries } = useMoodDiary()
  const { stats: achievementStats, badges, loading: achievementsLoading } = useAchievements()
  const navigate = useNavigate()

  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false)

  useEffect(() => {
    if (!isConfigured || !user) {
      navigate('/auth')
    }
  }, [isConfigured, user, navigate])

  const handleSync = async () => {
    if (!user) return
    setSyncing(true)
    setSyncStatus(null)

    try {
      const result = await syncService.syncToCloud(user.id)
      if (result.success) {
        syncService.updateLastSync()
        setSyncStatus('Данные успешно синхронизированы')
      } else {
        setSyncStatus(`Ошибка: ${result.error}`)
      }
    } catch (error) {
      setSyncStatus('Произошла ошибка при синхронизации')
    } finally {
      setSyncing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleClearData = () => {
    clearResults()
    clearAllEntries()
    setShowClearDataConfirm(false)
  }

  const getLastSyncTime = () => {
    const status = syncService.getSyncStatus()
    if (!status.lastSync) return 'Никогда'
    return new Date(status.lastSync).toLocaleString('ru-RU')
  }

  const getTestStats = () => {
    const totalTests = results.length
    const uniqueTests = new Set(results.map(r => r.testId)).size
    const lastTest = results[0]
    return { totalTests, uniqueTests, lastTest }
  }

  const stats = getTestStats()
  const syncInfo = syncService.getSyncStatus()

  if (!user) {
    return null
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      <h1 className="text-3xl font-bold mb-6">Профиль</h1>

      {/* User Info */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.email}</h2>
            <p className="text-sm text-gray-500">
              Аккаунт создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Статистика</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="text-3xl font-bold text-primary">{stats.totalTests}</div>
            <div className="text-sm text-gray-500">Тестов пройдено</div>
          </div>
          <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="text-3xl font-bold text-primary">{stats.uniqueTests}</div>
            <div className="text-sm text-gray-500">Уникальных тестов</div>
          </div>
          <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="text-3xl font-bold text-primary">{entries.length}</div>
            <div className="text-sm text-gray-500">Записей в дневнике</div>
          </div>
          <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="text-3xl font-bold text-primary">{syncInfo.pendingCount}</div>
            <div className="text-sm text-gray-500">Ожидают синхронизации</div>
          </div>
        </div>
        {stats.lastTest && (
          <div className="mt-4 p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
            <div className="text-sm text-gray-500">Последний тест:</div>
            <div className="font-medium">{stats.lastTest.testName}</div>
            <div className="text-sm text-gray-500">
              {new Date(stats.lastTest.date).toLocaleDateString('ru-RU')}
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Достижения</h2>

        {achievementsLoading ? (
          <div className="text-center py-4 text-gray-500">Загрузка...</div>
        ) : (
          <>
            {/* Streak */}
            {achievementStats && (
              <div className="mb-6">
                <StreakCounter
                  current={achievementStats.streak.current}
                  longest={achievementStats.streak.longest}
                />
              </div>
            )}

            {/* Summary stats */}
            {achievementStats && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <div className="text-3xl font-bold text-primary">{achievementStats.testsCompleted}</div>
                  <div className="text-sm text-gray-500">Всего тестов</div>
                </div>
                <div className="text-center p-4 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <div className="text-3xl font-bold text-primary">{achievementStats.badgesEarned}</div>
                  <div className="text-sm text-gray-500">Значков получено</div>
                </div>
              </div>
            )}

            {/* Badges */}
            <h3 className="font-semibold mb-3">Ваши значки</h3>
            <BadgeList badges={badges} showAll={true} />
          </>
        )}
      </div>

      {/* Sync Section */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Синхронизация</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500">Последняя синхронизация</div>
            <div className="font-medium">{getLastSyncTime()}</div>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary flex items-center gap-2"
          >
            {syncing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Синхронизация...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Синхронизировать
              </>
            )}
          </button>
        </div>
        {syncStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            syncStatus.includes('Ошибка')
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Быстрые ссылки</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/history"
            className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-primary/10 transition flex items-center gap-3"
          >
            <span className="text-2xl">📋</span>
            <span>История тестов</span>
          </Link>
          <Link
            to="/progress"
            className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-primary/10 transition flex items-center gap-3"
          >
            <span className="text-2xl">📈</span>
            <span>Мой прогресс</span>
          </Link>
          <Link
            to="/mood"
            className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-primary/10 transition flex items-center gap-3"
          >
            <span className="text-2xl">📝</span>
            <span>Дневник настроения</span>
          </Link>
          <Link
            to="/tests"
            className="p-4 bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-primary/10 transition flex items-center gap-3"
          >
            <span className="text-2xl">🧪</span>
            <span>Пройти тест</span>
          </Link>
        </div>
      </div>

      {/* Data Management */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Управление данными</h2>
        <div className="space-y-3">
          <button
            onClick={() => setShowClearDataConfirm(true)}
            className="w-full p-3 text-left bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition flex items-center gap-3 text-yellow-700 dark:text-yellow-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Очистить все локальные данные</span>
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="card">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full p-3 text-center bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-red-600 dark:text-red-400 font-medium"
        >
          Выйти из аккаунта
        </button>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearDataConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Очистить данные?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Все локальные данные (результаты тестов, записи дневника) будут удалены.
              Данные в облаке останутся без изменений.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDataConfirm(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Выйти из аккаунта?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Вы уверены, что хотите выйти? Несинхронизированные данные могут быть потеряны.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
