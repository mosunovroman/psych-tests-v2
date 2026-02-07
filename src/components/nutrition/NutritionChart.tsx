import { useMemo } from 'react'
import { NutritionEntry, DailyTotals } from '../../types/nutrition'

interface NutritionChartProps {
  entries: NutritionEntry[]
  days?: number
  targets?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
}

export default function NutritionChart({ entries, days = 7, targets }: NutritionChartProps) {
  // Группируем записи по дням
  const dailyData = useMemo(() => {
    const today = new Date()
    const data: { date: string; label: string; totals: DailyTotals }[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayEntries = entries.filter(e => e.date.startsWith(dateStr))
      const totals = dayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        fat: acc.fat + entry.fat,
        carbs: acc.carbs + entry.carbs,
        entries: acc.entries + 1
      }), { calories: 0, protein: 0, fat: 0, carbs: 0, entries: 0 })

      data.push({
        date: dateStr,
        label: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
        totals
      })
    }

    return data
  }, [entries, days])

  // Находим максимальное значение для масштабирования
  const maxCalories = Math.max(
    ...dailyData.map(d => d.totals.calories),
    targets?.calories || 2000
  )

  if (entries.length === 0) {
    return (
      <div className="card text-center py-8">
        <span className="text-4xl mb-2 block">📊</span>
        <p className="text-gray-500 dark:text-gray-400">
          Добавьте записи в дневник, чтобы увидеть статистику
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Калории за {days} дней
      </h3>

      {/* Bar chart */}
      <div className="flex items-end gap-1 h-32 mb-2">
        {dailyData.map((day, i) => {
          const height = maxCalories > 0 ? (day.totals.calories / maxCalories) * 100 : 0
          const isToday = i === dailyData.length - 1
          const targetMet = targets && day.totals.calories >= targets.calories * 0.9 &&
                           day.totals.calories <= targets.calories * 1.1

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="w-full h-full flex items-end justify-center">
                <div
                  className={`w-full max-w-8 rounded-t transition-all ${
                    day.totals.calories === 0
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : targetMet
                        ? 'bg-green-500'
                        : isToday
                          ? 'bg-primary'
                          : 'bg-blue-400'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${Math.round(day.totals.calories)} ккал`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1">
        {dailyData.map(day => (
          <div key={day.date} className="flex-1 text-center">
            <span className="text-xs text-gray-500">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Target line indicator */}
      {targets && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-4 h-0.5 bg-green-500" />
          <span>Цель: {targets.calories} ккал</span>
        </div>
      )}

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {Math.round(dailyData.reduce((sum, d) => sum + d.totals.calories, 0) / days)}
            </p>
            <p className="text-xs text-gray-500">ккал/день</p>
          </div>
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              {Math.round(dailyData.reduce((sum, d) => sum + d.totals.protein, 0) / days)}
            </p>
            <p className="text-xs text-gray-500">белки</p>
          </div>
          <div>
            <p className="font-semibold text-yellow-600 dark:text-yellow-400">
              {Math.round(dailyData.reduce((sum, d) => sum + d.totals.fat, 0) / days)}
            </p>
            <p className="text-xs text-gray-500">жиры</p>
          </div>
          <div>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(dailyData.reduce((sum, d) => sum + d.totals.carbs, 0) / days)}
            </p>
            <p className="text-xs text-gray-500">углеводы</p>
          </div>
        </div>
      </div>
    </div>
  )
}
