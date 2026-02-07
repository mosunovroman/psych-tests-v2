interface MacroProgressProps {
  current: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  targets: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
}

interface CircularProgressProps {
  value: number
  max: number
  label: string
  unit: string
  color: string
  bgColor: string
}

function CircularProgress({ value, max, label, unit, color, bgColor }: CircularProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const isOver = value > max

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            strokeWidth="8"
            className={bgColor}
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={isOver ? 'stroke-red-500' : color}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-bold ${isOver ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {Math.round(value)}
          </span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-xs text-gray-500">из {max}</p>
    </div>
  )
}

export default function MacroProgress({ current, targets }: MacroProgressProps) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Прогресс за сегодня
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <CircularProgress
          value={current.calories}
          max={targets.calories}
          label="Калории"
          unit="ккал"
          color="stroke-green-500"
          bgColor="stroke-green-100 dark:stroke-green-900"
        />
        <CircularProgress
          value={current.protein}
          max={targets.protein}
          label="Белки"
          unit="г"
          color="stroke-red-500"
          bgColor="stroke-red-100 dark:stroke-red-900"
        />
        <CircularProgress
          value={current.fat}
          max={targets.fat}
          label="Жиры"
          unit="г"
          color="stroke-yellow-500"
          bgColor="stroke-yellow-100 dark:stroke-yellow-900"
        />
        <CircularProgress
          value={current.carbs}
          max={targets.carbs}
          label="Углеводы"
          unit="г"
          color="stroke-blue-500"
          bgColor="stroke-blue-100 dark:stroke-blue-900"
        />
      </div>
    </div>
  )
}
