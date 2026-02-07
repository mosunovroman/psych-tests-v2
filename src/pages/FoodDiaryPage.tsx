import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { NutritionEntry, MealType, mealTypeLabels, DailyTotals, FoodAnalysisResult } from '../types/nutrition'
import PhotoCapture from '../components/nutrition/PhotoCapture'
import NutritionChart from '../components/nutrition/NutritionChart'
import MacroProgress from '../components/nutrition/MacroProgress'

const STORAGE_KEY = 'mindpro_nutrition_diary'
const PROFILE_KEY = 'mindpro_nutrition_profile'

export default function FoodDiaryPage() {
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showForm, setShowForm] = useState(false)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [editingEntry, setEditingEntry] = useState<NutritionEntry | null>(null)
  const [targets, setTargets] = useState({ calories: 2000, protein: 150, fat: 70, carbs: 250 })
  const [hasProfile, setHasProfile] = useState(false)
  const [showBurnTips, setShowBurnTips] = useState(false)
  const [currentExcess, setCurrentExcess] = useState(0)

  // Form state
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [foodName, setFoodName] = useState('')
  const [portionSize, setPortionSize] = useState('')
  const [calories, setCalories] = useState(0)
  const [protein, setProtein] = useState(0)
  const [fat, setFat] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [notes, setNotes] = useState('')

  // Load entries and profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setEntries(parsed)
        }
      }
    } catch {
      // Invalid data in localStorage, start fresh
      localStorage.removeItem(STORAGE_KEY)
    }

    try {
      const profileData = localStorage.getItem(PROFILE_KEY)
      if (profileData) {
        const data = JSON.parse(profileData)
        if (data?.result) {
          setTargets({
            calories: data.result.calories || 2000,
            protein: data.result.protein || 150,
            fat: data.result.fat || 70,
            carbs: data.result.carbs || 250
          })
          setHasProfile(true)
        }
      }
    } catch {
      // Invalid profile data, use defaults
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = useCallback((newEntries: NutritionEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
    setEntries(newEntries)
  }, [])

  // Get entries for selected date
  const todayEntries = entries.filter(e => e.date.startsWith(selectedDate))

  // Calculate daily totals
  const dailyTotals: DailyTotals = todayEntries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + entry.protein,
    fat: acc.fat + entry.fat,
    carbs: acc.carbs + entry.carbs,
    entries: acc.entries + 1
  }), { calories: 0, protein: 0, fat: 0, carbs: 0, entries: 0 })

  // Group entries by meal type
  const entriesByMeal = todayEntries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) acc[entry.mealType] = []
    acc[entry.mealType].push(entry)
    return acc
  }, {} as Record<MealType, NutritionEntry[]>)

  const resetForm = () => {
    setFoodName('')
    setPortionSize('')
    setCalories(0)
    setProtein(0)
    setFat(0)
    setCarbs(0)
    setNotes('')
    setEditingEntry(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!foodName.trim()) return

    const newEntry: NutritionEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      date: selectedDate + 'T' + new Date().toTimeString().split(' ')[0],
      mealType,
      foodName: foodName.trim(),
      portionSize: portionSize.trim(),
      calories,
      protein,
      fat,
      carbs,
      aiAnalyzed: false,
      notes: notes.trim(),
      createdAt: editingEntry?.createdAt || new Date().toISOString()
    }

    if (editingEntry) {
      saveEntries(entries.map(e => e.id === editingEntry.id ? newEntry : e))
    } else {
      saveEntries([newEntry, ...entries])
    }

    resetForm()
    setShowForm(false)
  }

  const handleEdit = (entry: NutritionEntry) => {
    setEditingEntry(entry)
    setMealType(entry.mealType)
    setFoodName(entry.foodName)
    setPortionSize(entry.portionSize)
    setCalories(entry.calories)
    setProtein(entry.protein)
    setFat(entry.fat)
    setCarbs(entry.carbs)
    setNotes(entry.notes || '')
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Удалить эту запись?')) {
      saveEntries(entries.filter(e => e.id !== id))
    }
  }

  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const handlePhotoAnalysis = (result: FoodAnalysisResult) => {
    // Добавляем все распознанные продукты как записи
    const newEntries: NutritionEntry[] = result.foods.map(food => ({
      id: crypto.randomUUID(),
      date: selectedDate + 'T' + new Date().toTimeString().split(' ')[0],
      mealType,
      foodName: food.name,
      portionSize: food.portion,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      glycemicIndex: food.glycemicIndex,
      aiAnalyzed: true,
      notes: `AI уверенность: ${Math.round(food.confidence * 100)}%`,
      createdAt: new Date().toISOString()
    }))

    saveEntries([...newEntries, ...entries])
    setShowPhotoCapture(false)
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <div className="animate-fade-in">
      <Link to="/nutrition" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к питанию
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Дневник питания
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Записывайте приёмы пищи и отслеживайте КБЖУ
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPhotoCapture(true)}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-sm sm:text-base"
            title="Анализ фото еды"
          >
            <span className="text-lg sm:text-xl">📸</span>
            <span className="hidden xs:inline">AI Фото</span>
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="btn-secondary flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Вручную</span>
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <p className="font-semibold text-gray-900 dark:text-white">
            {isToday ? 'Сегодня' : new Date(selectedDate).toLocaleDateString('ru-RU', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
          <p className="text-sm text-gray-500">{selectedDate}</p>
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          disabled={isToday}
        >
          <svg className={`w-5 h-5 ${isToday ? 'opacity-30' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Daily totals with progress */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Итого за день</h3>
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span>📊</span>
            {showStats ? 'Скрыть статистику' : 'Показать статистику'}
          </button>
        </div>

        {/* Calorie progress */}
        {(() => {
          const consumed = Math.round(dailyTotals.calories)
          const target = targets.calories
          const remaining = target - consumed
          const isOvereating = remaining < 0
          const progressPercent = Math.min((consumed / target) * 100, 100)
          const excessCalories = isOvereating ? Math.abs(remaining) : 0

          return (
            <div className="mb-4">
              {/* Main calorie display */}
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{consumed}</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400"> / {target} ккал</span>
                </div>
                <div className={`text-right ${isOvereating ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {isOvereating ? (
                    <span className="font-semibold">+{Math.abs(remaining)} ккал</span>
                  ) : (
                    <span className="font-semibold">Осталось: {remaining} ккал</span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isOvereating
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : progressPercent > 80
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Weight change prediction */}
              {hasProfile && (
                <div className={`mt-3 p-3 rounded-lg border ${
                  isOvereating
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                    : remaining > 200
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{isOvereating ? '📈' : remaining > 200 ? '📉' : '⚖️'}</span>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isOvereating
                          ? 'text-red-700 dark:text-red-300'
                          : remaining > 200
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {isOvereating
                          ? `Превышение на ${excessCalories} ккал`
                          : remaining > 200
                            ? `Дефицит ${remaining} ккал`
                            : 'Поддержание веса'
                        }
                      </p>
                      <div className={`text-sm mt-1 ${
                        isOvereating
                          ? 'text-red-600 dark:text-red-400'
                          : remaining > 200
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {isOvereating ? (
                          <div className="space-y-0.5">
                            <p>Сегодня: +{Math.round(excessCalories / 7.7)}г жира</p>
                            <p>За месяц: +{Math.round((excessCalories * 30) / 7700 * 1000)}г жира</p>
                          </div>
                        ) : remaining > 200 ? (
                          <div className="space-y-0.5">
                            <p>Сегодня: -{Math.round(remaining / 7.7)}г жира</p>
                            <p>За месяц: -{Math.round((remaining * 30) / 7700 * 1000)}г жира</p>
                          </div>
                        ) : (
                          <p>Вес останется стабильным</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Burn calories button */}
                  {isOvereating && (
                    <button
                      onClick={() => {
                        setCurrentExcess(excessCalories)
                        setShowBurnTips(true)
                      }}
                      className="mt-3 w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <span>🔥</span>
                      Как сжечь {excessCalories} ккал?
                    </button>
                  )}
                </div>
              )}

              {/* No profile warning */}
              {!hasProfile && (
                <div className="mt-3 space-y-3">
                  {/* Burn button for users without profile */}
                  {isOvereating && (
                    <button
                      onClick={() => {
                        setCurrentExcess(excessCalories)
                        setShowBurnTips(true)
                      }}
                      className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <span>🔥</span>
                      Как сжечь {excessCalories} ккал?
                    </button>
                  )}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Настройте профиль для точного расчёта нормы
                        </p>
                      </div>
                      <Link
                        to="/nutrition/calculator"
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                      >
                        Настроить →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(dailyTotals.calories)}</p>
            <p className="text-xs text-gray-500">ккал</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{Math.round(dailyTotals.protein)}</p>
            <p className="text-xs text-gray-500">белки</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{Math.round(dailyTotals.fat)}</p>
            <p className="text-xs text-gray-500">жиры</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(dailyTotals.carbs)}</p>
            <p className="text-xs text-gray-500">углеводы</p>
          </div>
        </div>
      </div>

      {/* Statistics section */}
      {showStats && (
        <div className="space-y-4 mb-6">
          <MacroProgress
            current={dailyTotals}
            targets={targets}
          />
          <NutritionChart
            entries={entries}
            days={7}
            targets={targets}
          />
        </div>
      )}

      {/* Entries by meal */}
      {todayEntries.length > 0 ? (
        <div className="space-y-4">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(meal => {
            const mealEntries = entriesByMeal[meal] || []
            if (mealEntries.length === 0) return null

            return (
              <div key={meal} className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  {meal === 'breakfast' && '🌅'}
                  {meal === 'lunch' && '☀️'}
                  {meal === 'dinner' && '🌙'}
                  {meal === 'snack' && '🍎'}
                  {mealTypeLabels[meal]}
                </h3>
                <div className="space-y-2">
                  {mealEntries.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{entry.foodName}</p>
                          {entry.glycemicIndex !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              entry.glycemicIndex >= 70
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                : entry.glycemicIndex >= 55
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            }`}>
                              ГИ {entry.glycemicIndex}
                            </span>
                          )}
                        </div>
                        {entry.portionSize && (
                          <p className="text-sm text-gray-500">{entry.portionSize}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">{entry.calories} ккал</p>
                          <p className="text-xs text-gray-500">
                            Б: {entry.protein} | Ж: {entry.fat} | У: {entry.carbs}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1 text-gray-400 hover:text-primary transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Записей за этот день пока нет
          </p>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="btn-primary"
          >
            Добавить первую запись
          </button>
        </div>
      )}

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <PhotoCapture
          onAnalysisComplete={handlePhotoAnalysis}
          onCancel={() => setShowPhotoCapture(false)}
        />
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEntry ? 'Редактировать' : 'Добавить приём пищи'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Meal type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Приём пищи
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(meal => (
                      <button
                        key={meal}
                        type="button"
                        onClick={() => setMealType(meal)}
                        className={`py-2 px-2 rounded-lg text-sm transition ${
                          mealType === meal
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {meal === 'breakfast' && '🌅'}
                        {meal === 'lunch' && '☀️'}
                        {meal === 'dinner' && '🌙'}
                        {meal === 'snack' && '🍎'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={foodName}
                    onChange={e => setFoodName(e.target.value)}
                    placeholder="Например: Овсяная каша с ягодами"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    required
                  />
                </div>

                {/* Portion size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Порция
                  </label>
                  <input
                    type="text"
                    value={portionSize}
                    onChange={e => setPortionSize(e.target.value)}
                    placeholder="Например: 200г или 1 тарелка"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>

                {/* KBJU */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Калории
                    </label>
                    <input
                      type="number"
                      value={calories}
                      onChange={e => setCalories(Number(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Белки (г)
                    </label>
                    <input
                      type="number"
                      value={protein}
                      onChange={e => setProtein(Number(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Жиры (г)
                    </label>
                    <input
                      type="number"
                      value={fat}
                      onChange={e => setFat(Number(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Углеводы (г)
                    </label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={e => setCarbs(Number(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Заметки
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Дополнительная информация..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm() }}
                    className="flex-1 btn-secondary"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingEntry ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Burn Calories Tips Modal */}
      {showBurnTips && (() => {
        // Расчёт для текущего избытка калорий
        const cals = currentExcess

        // Форматирование времени
        const formatTime = (mins: number) => {
          if (mins >= 60) {
            const h = Math.floor(mins / 60)
            const m = mins % 60
            return m > 0 ? `${h} ч ${m} мин` : `${h} ч`
          }
          return `${mins} мин`
        }

        // Активности с калориями на единицу
        const activities = [
          { emoji: '🏃', name: 'Бег', value: Math.round(cals / 60 * 10) / 10, unit: 'км', note: '~60 ккал/км' },
          { emoji: '🚶', name: 'Ходьба', value: Math.round(cals / 40 * 10) / 10, unit: 'км', note: '~40 ккал/км' },
          { emoji: '🥊', name: 'Бокс с грушей', value: formatTime(Math.ceil(cals / 10)), unit: '', note: '~10 ккал/мин' },
          { emoji: '🏊', name: 'Плавание', value: formatTime(Math.ceil(cals / 9)), unit: '', note: '~9 ккал/мин' },
          { emoji: '🚴', name: 'Велосипед', value: formatTime(Math.ceil(cals / 8)), unit: '', note: '~8 ккал/мин' },
          { emoji: '🧗', name: 'Скакалка', value: formatTime(Math.ceil(cals / 12)), unit: '', note: '~12 ккал/мин' },
          { emoji: '💪', name: 'Подтягивания', value: Math.ceil(cals / 1), unit: 'раз', note: '~1 ккал/раз' },
          { emoji: '🫸', name: 'Отжимания', value: Math.ceil(cals / 0.5), unit: 'раз', note: '~0.5 ккал/раз' },
          { emoji: '🦵', name: 'Приседания', value: Math.ceil(cals / 0.3), unit: 'раз', note: '~0.3 ккал/раз' },
          { emoji: '🚶‍♂️', name: 'Выпады', value: Math.ceil(cals / 0.3), unit: 'раз', note: '~0.3 ккал/раз' },
          { emoji: '💃', name: 'Танцы', value: formatTime(Math.ceil(cals / 6)), unit: '', note: '~6 ккал/мин' },
          { emoji: '🧹', name: 'Уборка', value: formatTime(Math.ceil(cals / 4)), unit: '', note: '~4 ккал/мин' },
        ]

        // Шуточные активности
        const funActivities = [
          { emoji: '🔥', name: 'Секс', value: formatTime(Math.ceil(cals / 4)), note: '~4 ккал/мин' },
          { emoji: '😘', name: 'Поцелуи', value: formatTime(Math.ceil(cals / 2)), note: '~2 ккал/мин' },
          { emoji: '😂', name: 'Смех', value: formatTime(Math.ceil(cals / 1.5)), note: '~1.5 ккал/мин' },
          { emoji: '🌬️', name: 'Глубокое дыхание', value: formatTime(Math.ceil(cals / 0.05)), note: '~0.05 ккал/мин' },
          { emoji: '🛋️', name: 'Лежать и страдать', value: '∞', note: 'бесполезно' },
        ]

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBurnTips(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  🔥 Сжечь {cals} ккал
                </h3>
                <button
                  onClick={() => setShowBurnTips(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Спортивные активности:</p>

                {activities.map((a) => (
                  <div key={a.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{a.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.note}</p>
                      </div>
                    </div>
                    <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                      {a.value}{a.unit && ` ${a.unit}`}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Альтернативные способы:</p>

                  {funActivities.map((a) => (
                    <div key={a.name} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{a.emoji}</span>
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{a.name}</p>
                          <p className="text-xs text-gray-400">{a.note}</p>
                        </div>
                      </div>
                      <span className="text-orange-500 dark:text-orange-400 font-semibold">{a.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <p className="text-xs text-gray-400">
                    * Расчёт приблизительный для человека ~70 кг
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Floating Action Button для мобильных */}
      <button
        onClick={() => setShowPhotoCapture(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl z-40 md:hidden active:scale-95 transition-transform"
        aria-label="Сфотографировать еду"
      >
        📸
      </button>
    </div>
  )
}
