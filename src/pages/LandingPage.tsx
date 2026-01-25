import { Link } from 'react-router-dom'

const psychologyFacts = [
  {
    icon: '🧠',
    fact: 'Мозг потребляет около 20% всей энергии организма, хотя составляет лишь 2% массы тела'
  },
  {
    icon: '💭',
    fact: 'Человек в среднем имеет от 12 000 до 60 000 мыслей в день, и около 80% из них — негативные'
  },
  {
    icon: '😊',
    fact: 'Улыбка, даже искусственная, способна улучшить настроение благодаря обратной связи мышц лица с мозгом'
  },
  {
    icon: '🎵',
    fact: 'Музыка активирует те же области мозга, что и еда и секс — центры удовольствия'
  },
  {
    icon: '🌙',
    fact: 'Во время сна мозг обрабатывает эмоции и закрепляет воспоминания — поэтому сон важен для психического здоровья'
  },
  {
    icon: '🤝',
    fact: 'Социальные связи так же важны для здоровья, как правильное питание и физические упражнения'
  }
]

const sections = [
  {
    title: 'Психологические тесты',
    description: 'Научно обоснованные методики для самодиагностики: депрессия, тревожность, стресс, самооценка',
    icon: '📊',
    link: '/tests',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Релаксация',
    description: 'Дыхательные упражнения и техники заземления для снятия стресса и тревоги',
    icon: '🧘',
    link: '/relax',
    color: 'from-green-500 to-teal-600'
  },
  {
    title: 'AI-помощник',
    description: 'Чат-бот для первичной консультации и поддержки на основе принципов КПТ',
    icon: '🤖',
    link: '/tests',
    color: 'from-purple-500 to-pink-600',
    note: 'Доступен на всех страницах'
  },
  {
    title: 'История и прогресс',
    description: 'Графики динамики и экспорт результатов в PDF',
    icon: '📈',
    link: '/progress',
    color: 'from-amber-500 to-orange-600'
  }
]

export default function LandingPage() {
  // Get random 3 facts
  const randomFacts = [...psychologyFacts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-12 mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-4xl mb-6">
          Ψ
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Психологические инструменты
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Бесплатные научно обоснованные тесты для самодиагностики,
          техники релаксации и AI-помощник на основе когнитивно-поведенческой терапии
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tests" className="btn-primary px-8 py-3 text-lg">
            Пройти тест
          </Link>
          <Link to="/relax" className="btn-secondary px-8 py-3 text-lg">
            Техники релаксации
          </Link>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">Разделы сайта</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.link}
              className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${section.color} -mx-6 -mt-6 mb-4`} />
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
              {section.note && (
                <p className="text-xs text-primary mt-2">{section.note}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Psychology Facts */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">
          Интересные факты о психологии
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {randomFacts.map((item, index) => (
            <div
              key={index}
              className="card bg-gradient-to-br from-surface-light to-white dark:from-surface-dark dark:to-gray-800"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Block */}
      <section className="card bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div>
            <h3 className="font-semibold mb-2">Важная информация</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Все тесты на этом сайте предназначены для самодиагностики и не заменяют
              консультацию специалиста. Если вы испытываете серьёзные симптомы депрессии,
              тревоги или других психических расстройств, пожалуйста, обратитесь к
              психологу или психотерапевту.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="tel:8-800-2000-122"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                📞 8-800-2000-122
                <span className="text-xs text-gray-400">(бесплатно, круглосуточно)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
