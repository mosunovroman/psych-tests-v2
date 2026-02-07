import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  NutritionProfile,
  KBJUResult,
  Gender,
  ActivityLevel,
  Goal,
  activityLevelLabels,
  goalLabels,
  activityMultipliers,
  goalCalorieAdjustment
} from '../types/nutrition'

const STORAGE_KEY = 'mindpro_nutrition_profile'

// Формула Mifflin-St Jeor для расчёта базового метаболизма
function calculateBMR(profile: NutritionProfile): number {
  const { gender, weight, height, age } = profile
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

// Расчёт КБЖУ
function calculateKBJU(profile: NutritionProfile): KBJUResult {
  const bmr = calculateBMR(profile)
  const tdee = bmr * activityMultipliers[profile.activityLevel]
  const calories = Math.round(tdee + goalCalorieAdjustment[profile.goal])

  // Распределение макронутриентов
  // Белок: 1.6-2.2 г/кг при похудении, 1.2-1.6 г/кг при поддержании/наборе
  const proteinPerKg = profile.goal === 'lose' ? 2.0 : 1.6
  const protein = Math.round(profile.weight * proteinPerKg)

  // Жиры: 25-30% калорий
  const fatCalories = calories * 0.25
  const fat = Math.round(fatCalories / 9)

  // Углеводы: остаток калорий
  const proteinCalories = protein * 4
  const carbCalories = calories - proteinCalories - fatCalories
  const carbs = Math.round(carbCalories / 4)

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), calories, protein, fat, carbs }
}

const defaultProfile: NutritionProfile = {
  gender: 'male' as Gender,
  age: 30,
  height: 175,
  weight: 70,
  activityLevel: 'moderate' as ActivityLevel,
  goal: 'maintain' as Goal
}

export default function KBJUCalculatorPage() {
  const [profile, setProfile] = useState<NutritionProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate parsed data has required fields
        if (parsed && parsed.gender && parsed.age && parsed.height && parsed.weight) {
          return { ...defaultProfile, ...parsed }
        }
      }
    } catch {
      // Invalid data, use default
    }
    return defaultProfile
  })

  const [result, setResult] = useState<KBJUResult | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Автоматически пересчитываем при изменении профиля
    if (profile.age > 0 && profile.height > 0 && profile.weight > 0) {
      setResult(calculateKBJU(profile))
    }
  }, [profile])

  const handleSave = () => {
    // Сохраняем профиль вместе с расчётом
    const dataToSave = {
      ...profile,
      result: result
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in">
      <Link to="/nutrition" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к питанию
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Калькулятор КБЖУ
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Рассчитайте свою дневную норму калорий и макронутриентов
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Форма */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ваши параметры
          </h2>

          {/* Пол */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пол
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setProfile({ ...profile, gender: 'male' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                  profile.gender === 'male'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                👨 Мужской
              </button>
              <button
                onClick={() => setProfile({ ...profile, gender: 'female' })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition ${
                  profile.gender === 'female'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                👩 Женский
              </button>
            </div>
          </div>

          {/* Возраст */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Возраст: {profile.age} лет
            </label>
            <input
              type="range"
              min="16"
              max="80"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>16</span>
              <span>80</span>
            </div>
          </div>

          {/* Рост */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Рост: {profile.height} см
            </label>
            <input
              type="range"
              min="140"
              max="220"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>140 см</span>
              <span>220 см</span>
            </div>
          </div>

          {/* Вес */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Вес: {profile.weight} кг
            </label>
            <input
              type="range"
              min="40"
              max="150"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40 кг</span>
              <span>150 кг</span>
            </div>
          </div>

          {/* Активность */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Уровень активности
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Object.entries(activityLevelLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Цель */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Цель
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(goalLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setProfile({ ...profile, goal: value as Goal })}
                  className={`py-2 px-1 rounded-lg border-2 text-xs sm:text-sm transition text-center leading-tight ${
                    profile.goal === value
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary"
          >
            {saved ? '✓ Сохранено!' : 'Сохранить профиль'}
          </button>
        </div>

        {/* Результаты */}
        {result && (
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ваша дневная норма
            </h2>

            {/* Калории */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Калории</p>
                <p className="text-4xl font-bold text-primary">{result.calories}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ккал / день</p>
              </div>
            </div>

            {/* Макронутриенты */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥩</span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.protein}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">г белка</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥑</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.fat}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">г жиров</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🍞</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.carbs}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">г углеводов</p>
              </div>
            </div>

            {/* Детали */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Базовый метаболизм (BMR)</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.bmr} ккал</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">С учётом активности (TDEE)</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.tdee} ккал</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Корректировка для цели</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {goalCalorieAdjustment[profile.goal] > 0 ? '+' : ''}{goalCalorieAdjustment[profile.goal]} ккал
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
              * Расчёт по формуле Mifflin-St Jeor
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
