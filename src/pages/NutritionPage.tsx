import { Link } from 'react-router-dom'

export default function NutritionPage() {
  const features = [
    {
      id: 'diary',
      title: 'Дневник питания',
      description: 'Записывайте приёмы пищи, анализируйте еду по фото с помощью AI',
      icon: '📸',
      link: '/nutrition/diary',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'calculator',
      title: 'Калькулятор КБЖУ',
      description: 'Рассчитайте свою дневную норму калорий, белков, жиров и углеводов',
      icon: '🎯',
      link: '/nutrition/calculator',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'recipes',
      title: 'Рецепты',
      description: 'Здоровые рецепты с подсчитанным КБЖУ на порцию',
      icon: '👨‍🍳',
      link: '/nutrition/recipes',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const tips = [
    'Пейте не менее 2 литров воды в день',
    'Ешьте медленно — это помогает лучше чувствовать насыщение',
    'Включайте белок в каждый приём пищи',
    'Овощи должны занимать половину вашей тарелки',
    'Планируйте меню на неделю вперёд'
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
          <span className="text-4xl">🥗</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Тело
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Питание и физическое здоровье</p>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Контролируйте питание с AI-анализом фото еды, калькулятором КБЖУ и базой полезных рецептов
        </p>
      </div>

      {/* Getting Started Instructions - First! */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              С чего начать?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Три простых шага для контроля питания
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/nutrition/calculator" className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition group">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition">Настройте профиль</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Рост, вес, возраст и цель</p>
            </div>
          </Link>
          <Link to="/nutrition/diary" className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition group">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition">Фотографируйте еду</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI подсчитает КБЖУ</p>
            </div>
          </Link>
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Следите за нормой</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Не переедайте</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip of the day */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-8 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">Совет дня</p>
            <p className="text-green-700 dark:text-green-300 text-sm">{randomTip}</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={feature.link}
            className="group card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {feature.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {feature.description}
            </p>
            <div className="mt-4 flex items-center text-primary font-medium text-sm">
              Открыть
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
        Данные о калорийности и пищевой ценности носят приблизительный характер.
        Для составления диеты проконсультируйтесь с диетологом.
      </p>
    </div>
  )
}
