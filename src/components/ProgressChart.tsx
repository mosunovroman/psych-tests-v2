import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { TestResult } from '../hooks/useTestResults'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ProgressChartProps {
  results: TestResult[]
  testId?: string
  dateRange?: 'week' | 'month' | 'year' | 'all'
}

const testColors: Record<string, { border: string; bg: string }> = {
  phq9: { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
  gad7: { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' },
  dass21: { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
  rosenberg: { border: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.1)' },
  pss10: { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.1)' },
  burnout: { border: 'rgb(236, 72, 153)', bg: 'rgba(236, 72, 153, 0.1)' },
  atq: { border: 'rgb(20, 184, 166)', bg: 'rgba(20, 184, 166, 0.1)' },
  distortions: { border: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' },
  bhs: { border: 'rgb(107, 114, 128)', bg: 'rgba(107, 114, 128, 0.1)' }
}

export default function ProgressChart({ results, testId, dateRange = 'all' }: ProgressChartProps) {
  const filteredResults = useMemo(() => {
    let filtered = [...results]

    // Filter by test
    if (testId) {
      filtered = filtered.filter(r => r.testId === testId)
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date()
      const cutoff = new Date()

      switch (dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoff.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter(r => new Date(r.date) >= cutoff)
    }

    // Sort by date ascending
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [results, testId, dateRange])

  const chartData = useMemo(() => {
    if (filteredResults.length === 0) {
      return null
    }

    // Group by test ID for multiple lines
    const testGroups = filteredResults.reduce((acc, result) => {
      if (!acc[result.testId]) {
        acc[result.testId] = []
      }
      acc[result.testId].push(result)
      return acc
    }, {} as Record<string, TestResult[]>)

    const datasets = Object.entries(testGroups).map(([id, data]) => {
      const color = testColors[id] || { border: 'rgb(74, 111, 165)', bg: 'rgba(74, 111, 165, 0.1)' }

      return {
        label: data[0].testName,
        data: data.map(r => ({
          x: new Date(r.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
          y: (r.score / r.maxScore) * 100 // Normalize to percentage
        })),
        borderColor: color.border,
        backgroundColor: color.bg,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    })

    // Get all unique labels (dates)
    const allLabels = [...new Set(filteredResults.map(r =>
      new Date(r.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    ))]

    return {
      labels: allLabels,
      datasets
    }
  }, [filteredResults])

  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-lg font-medium">Нет данных для отображения</p>
        <p className="text-sm">Пройдите тесты, чтобы увидеть график прогресса</p>
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(0)}%`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: string | number) => `${value}%`
        },
        title: {
          display: true,
          text: 'Результат (% от максимума)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Дата'
        }
      }
    }
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  )
}
