import { useState } from 'react'
import { Link } from 'react-router-dom'
import WellnessIllustration from '../components/illustrations/WellnessIllustration'
import BrainIllustration from '../components/illustrations/BrainIllustration'
import MeditationIllustration from '../components/illustrations/MeditationIllustration'
import NewsFeed from '../components/NewsFeed'

const psychologyFacts = [
  { icon: '🧠', fact: 'Мозг потребляет около 20% всей энергии организма, хотя составляет лишь 2% массы тела' },
  { icon: '💭', fact: 'Человек в среднем имеет от 12 000 до 60 000 мыслей в день, и около 80% из них — негативные' },
  { icon: '😊', fact: 'Улыбка, даже искусственная, способна улучшить настроение благодаря обратной связи мышц лица с мозгом' },
  { icon: '🎵', fact: 'Музыка активирует центры удовольствия мозга — те же области, что отвечают за награду и мотивацию' },
  { icon: '🌙', fact: 'Во время сна мозг обрабатывает эмоции и закрепляет воспоминания — поэтому сон важен для психического здоровья' },
  { icon: '🤝', fact: 'Социальные связи так же важны для здоровья, как правильное питание и физические упражнения' },
  { icon: '🏃', fact: '20 минут физической активности могут улучшить настроение на 12 часов благодаря выбросу эндорфинов' },
  { icon: '📱', fact: 'Синий свет экранов подавляет выработку мелатонина — откладывайте телефон за час до сна' },
  { icon: '🌿', fact: 'Прогулка на природе снижает уровень кортизола (гормона стресса) на 12-16%' },
  { icon: '✍️', fact: 'Ведение дневника благодарности повышает уровень счастья на 25% уже через 2 недели' },
  { icon: '🧘', fact: '10 минут медитации в день увеличивают плотность серого вещества в областях мозга, связанных с памятью и эмпатией' },
  { icon: '💪', fact: 'Самооценка формируется в возрасте до 5 лет и влияет на всю последующую жизнь' },
  { icon: '🎯', fact: 'Запись целей увеличивает вероятность их достижения на 42%' },
  { icon: '🫂', fact: 'Объятие длительностью 20 секунд вызывает выброс окситоцина и снижает артериальное давление' },
  { icon: '🌅', fact: 'Утренний свет помогает установить циркадные ритмы и улучшает качество сна ночью' }
]

// Get random facts - changes on each page load
const getRandomFacts = () => [...psychologyFacts].sort(() => Math.random() - 0.5).slice(0, 3)

export default function LandingPage() {
  // Facts are randomized once on component mount (page load)
  const [facts] = useState(getRandomFacts)

  return (
    <div className="animate-fade-in">
      {/* Hero Section with Illustration */}
      <section className="relative py-8 md:py-12 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Бесплатно и конфиденциально
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Забота о вашем ментальном здоровье
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              Научно обоснованные тесты, техники релаксации и AI-помощник на основе когнитивно-поведенческой терапии
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/tests" className="btn-primary px-8 py-3 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Пройти тест
              </Link>
              <Link to="/relax" className="btn-secondary px-8 py-3 text-lg">
                Техники релаксации
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center md:justify-start gap-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">13+</div>
                <div className="text-xs text-gray-500">Тестов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-xs text-gray-500">Техники дыхания</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-gray-500">AI-помощник</div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md">
              <WellnessIllustration className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Main Sections with Illustrations */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Инструменты для вашего благополучия</h2>
          <p className="text-gray-500 dark:text-gray-400">Выберите то, что вам нужно прямо сейчас</p>
        </div>

        {/* Featured Cards with Illustrations */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/tests"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-50">
              <BrainIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                Психологические тесты
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Депрессия, тревожность, стресс, самооценка и другие научные методики
              </p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600">
                Пройти тест
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          <Link
            to="/mood"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-40">
              <WellnessIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                📝
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-rose-600 transition-colors">
                Дневник настроения
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Отслеживайте эмоции, энергию и тревогу каждый день
              </p>
              <span className="inline-flex items-center text-sm font-medium text-rose-600">
                Открыть дневник
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          <Link
            to="/relax"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-50">
              <MeditationIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                🧘
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                Релаксация
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Дыхательные упражнения и техники заземления
              </p>
              <span className="inline-flex items-center text-sm font-medium text-green-600">
                Начать практику
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Secondary Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/tests"
            className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              🤖
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">AI-помощник</h3>
              <p className="text-sm text-gray-500">Чат-бот на основе КПТ</p>
            </div>
            <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded-full">
              24/7
            </span>
          </Link>

          <Link
            to="/progress"
            className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              📈
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Прогресс и история</h3>
              <p className="text-sm text-gray-500">Графики и экспорт в PDF</p>
            </div>
          </Link>
        </div>
      </section>

      {/* News Feed Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                📰
              </div>
              <div>
                <h2 className="text-xl font-bold">Новости психологии</h2>
                <p className="text-sm text-gray-500">Последние открытия и исследования</p>
              </div>
            </div>
            <div className="card">
              <NewsFeed />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                💡
              </div>
              <div>
                <h2 className="text-xl font-bold">Знали ли вы?</h2>
                <p className="text-sm text-gray-500">Интересные факты</p>
              </div>
            </div>
            <div className="space-y-4">
              {facts.map((item, index) => (
                <div
                  key={index}
                  className="card bg-gradient-to-br from-surface-light to-white dark:from-surface-dark dark:to-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.fact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Help Banner */}
      <section className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800/50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <span className="text-2xl">🆘</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-800 dark:text-red-300 mb-1">Нужна срочная помощь?</h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              Если вы или кто-то из ваших близких находится в кризисной ситуации, позвоните на телефон доверия.
            </p>
          </div>
          <a
            href="tel:8-800-2000-122"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            8-800-2000-122
          </a>
        </div>
        <p className="text-xs text-red-600 dark:text-red-400 mt-3 ml-16">
          Бесплатно, анонимно, круглосуточно по всей России
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Все тесты на этом сайте предназначены для самодиагностики и не заменяют консультацию специалиста.
        </p>
      </section>
    </div>
  )
}
