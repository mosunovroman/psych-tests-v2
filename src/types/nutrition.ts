// Типы для раздела питания

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type Gender = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type Goal = 'lose' | 'maintain' | 'gain'

// Запись о приёме пищи
export interface NutritionEntry {
  id: string
  date: string
  mealType: MealType
  foodName: string
  portionSize: string
  calories: number
  protein: number
  fat: number
  carbs: number
  glycemicIndex?: number  // Гликемический индекс (0-100)
  imageUrl?: string
  aiAnalyzed: boolean
  aiConfidence?: number
  notes?: string
  createdAt: string
}

// Профиль пользователя для калькулятора КБЖУ
export interface NutritionProfile {
  gender: Gender
  age: number
  height: number // см
  weight: number // кг
  activityLevel: ActivityLevel
  goal: Goal
}

// Результат расчёта КБЖУ
export interface KBJUResult {
  bmr: number           // Базовый метаболизм
  tdee: number          // Суточный расход с учётом активности
  calories: number      // Рекомендуемые калории (с учётом цели)
  protein: number       // Белки (г)
  fat: number           // Жиры (г)
  carbs: number         // Углеводы (г)
}

// Итоги за день
export interface DailyTotals {
  calories: number
  protein: number
  fat: number
  carbs: number
  entries: number
}

// Ответ AI анализа фото
export interface FoodAnalysisResult {
  foods: Array<{
    name: string
    portion: string
    calories: number
    protein: number
    fat: number
    carbs: number
    glycemicIndex?: number  // Гликемический индекс (0-100)
    confidence: number
  }>
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  averageGI?: number  // Средний ГИ блюда
}

// Рецепт
export interface Recipe {
  id: string
  name: string
  description: string
  image: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'low-carb')[]
  prepTime: number // минуты
  cookTime: number
  servings: number
  perServing: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  ingredients: Array<{ name: string; amount: string }>
  steps: string[]
}

// Фильтры рецептов
export interface RecipeFilters {
  category?: Recipe['category']
  dietary?: Recipe['dietary'][number]
  maxCalories?: number
  maxPrepTime?: number
}

// Названия типов приёмов пищи
export const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
  snack: 'Перекус'
}

// Названия уровней активности
export const activityLevelLabels: Record<ActivityLevel, string> = {
  sedentary: 'Сидячий образ жизни',
  light: 'Лёгкая активность (1-2 раза в неделю)',
  moderate: 'Умеренная активность (3-4 раза в неделю)',
  active: 'Высокая активность (5-6 раз в неделю)',
  very_active: 'Очень высокая активность (ежедневно)'
}

// Названия целей
export const goalLabels: Record<Goal, string> = {
  lose: 'Похудеть',
  maintain: 'Удержать',
  gain: 'Набрать'
}

// Коэффициенты активности для расчёта TDEE
export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
}

// Корректировка калорий по цели
export const goalCalorieAdjustment: Record<Goal, number> = {
  lose: -500,      // Дефицит 500 ккал
  maintain: 0,
  gain: 300        // Профицит 300 ккал
}
