import { Link } from 'react-router-dom'
import { useTestResults } from '../hooks/useTestResults'
import { getTestById } from '../mocks/testConfigs'

export default function HistoryPage() {
  const { results, deleteResult, clearResults } = useTestResults()

  const levelColors = {
    minimal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    mild: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">История результатов</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ваши пройденные тесты
          </p>
        </div>
        {results.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Удалить всю историю результатов?')) {
                clearResults()
              }
            }}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Очистить
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">Нет результатов</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Пройдите тест, чтобы увидеть результаты здесь
          </p>
          <Link to="/tests" className="btn-primary">
            Перейти к тестам
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const test = getTestById(result.testId)
            return (
              <div key={result.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                      {test?.icon || '📊'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{result.testName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(result.date)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                          {result.score}
                        </span>
                        <span className="text-gray-400">/ {result.maxScore}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[result.level]}`}>
                          {result.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/tests/${result.testId}`}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      title="Пройти снова"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteResult(result.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      title="Удалить"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
