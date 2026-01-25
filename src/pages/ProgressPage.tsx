import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTestResults } from '../hooks/useTestResults'
import ProgressChart from '../components/ProgressChart'
import { tests } from '../mocks/testConfigs'

type DateRange = 'week' | 'month' | 'year' | 'all'

export default function ProgressPage() {
  const { results } = useTestResults()
  const [selectedTest, setSelectedTest] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange>('all')

  const testsWithResults = tests.filter(t =>
    results.some(r => r.testId === t.id)
  )

  const dateRanges: { value: DateRange; label: string }[] = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'year', label: 'Год' },
    { value: 'all', label: 'Все время' }
  ]

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">График прогресса</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Отслеживайте динамику ваших результатов
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Test filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Тест</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary outline-none transition"
            >
              <option value="">Все тесты</option>
              {testsWithResults.map(test => (
                <option key={test.id} value={test.id}>
                  {test.icon} {test.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Период</label>
            <div className="flex gap-1">
              {dateRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    dateRange === range.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <ProgressChart
          results={results}
          testId={selectedTest || undefined}
          dateRange={dateRange}
        />
      </div>

      {/* Stats summary */}
      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">{results.length}</div>
            <div className="text-sm text-gray-500">Тестов пройдено</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">
              {new Set(results.map(r => r.testId)).size}
            </div>
            <div className="text-sm text-gray-500">Разных тестов</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary">
              {results.length > 0
                ? new Date(results[0].date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                  })
                : '-'
              }
            </div>
            <div className="text-sm text-gray-500">Последний тест</div>
          </div>
        </div>
      )}

      {/* Link to history */}
      <div className="mt-6 text-center">
        <Link to="/history" className="text-primary hover:underline">
          Посмотреть подробную историю результатов
        </Link>
      </div>
    </div>
  )
}
