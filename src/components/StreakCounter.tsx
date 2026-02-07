interface StreakCounterProps {
  current: number
  longest: number
  compact?: boolean
}

export default function StreakCounter({ current, longest, compact = false }: StreakCounterProps) {
  const getStreakEmoji = () => {
    if (current >= 30) return '🌟'
    if (current >= 14) return '⭐'
    if (current >= 7) return '💪'
    if (current >= 3) return '🔥'
    return '✨'
  }

  const getStreakMessage = () => {
    if (current === 0) return 'Начните серию сегодня!'
    if (current === 1) return 'Отличное начало!'
    if (current < 3) return 'Продолжайте в том же духе!'
    if (current < 7) return 'Вы на верном пути!'
    if (current < 14) return 'Впечатляющая серия!'
    if (current < 30) return 'Невероятная стабильность!'
    return 'Вы настоящий мастер!'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-2 rounded-lg">
        <span className="text-2xl">{getStreakEmoji()}</span>
        <div>
          <span className="font-bold text-orange-700">{current}</span>
          <span className="text-orange-600 text-sm ml-1">
            {current === 1 ? 'день' : current < 5 ? 'дня' : 'дней'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Серия активности</h3>
        <span className="text-3xl">{getStreakEmoji()}</span>
      </div>

      <div className="flex items-end gap-6">
        <div className="flex-1">
          <div className="text-5xl font-bold text-orange-600 mb-1">{current}</div>
          <div className="text-gray-600">
            {current === 1 ? 'день подряд' : current < 5 ? 'дня подряд' : 'дней подряд'}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Рекорд</div>
          <div className="text-2xl font-semibold text-amber-600">{longest}</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-orange-700 bg-orange-100 rounded-lg px-3 py-2">
        {getStreakMessage()}
      </p>
    </div>
  )
}
