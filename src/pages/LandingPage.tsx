import { Link } from 'react-router-dom'
import WellnessIllustration from '../components/illustrations/WellnessIllustration'
import BrainIllustration from '../components/illustrations/BrainIllustration'
import MeditationIllustration from '../components/illustrations/MeditationIllustration'

export default function LandingPage() {

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
              Ваше благополучие — в ваших руках
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              Тело, разум, практики — всё для качества жизни. AI-анализ питания, психологические тесты и техники самопомощи.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link to="/nutrition" className="btn-primary px-6 py-3 text-base shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all bg-gradient-to-r from-green-500 to-emerald-600">
                🥗 Тело
              </Link>
              <Link to="/tests" className="btn-primary px-6 py-3 text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all bg-gradient-to-r from-blue-500 to-indigo-600">
                🧠 Разум
              </Link>
              <Link to="/relax" className="btn-primary px-6 py-3 text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all bg-gradient-to-r from-purple-500 to-pink-600">
                🌟 Практики
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center md:justify-start gap-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">AI</div>
                <div className="text-xs text-gray-500">Анализ питания</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">13+</div>
                <div className="text-xs text-gray-500">Тестов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-gray-500">Практики</div>
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

        {/* Three Pillars of Wellbeing */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Тело */}
          <Link
            to="/nutrition"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-50">
              <WellnessIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                🥗
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                Тело
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Питание и физическое здоровье. AI-анализ фото еды, калькулятор КБЖУ, полезные рецепты.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">Питание</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">AI-фото</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">КБЖУ</span>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-green-600">
                Открыть раздел
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Разум */}
          <Link
            to="/tests"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-50">
              <BrainIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                🧠
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                Разум
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ментальное здоровье. 13+ научных тестов: депрессия, тревога, стресс, личность, IQ и EQ.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">Тесты</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">PHQ-9</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">MBTI</span>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-blue-600">
                Пройти тест
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Практики */}
          <Link
            to="/relax"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-50">
              <MeditationIllustration />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 shadow-lg">
                🌟
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Практики
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Инструменты самопомощи. Дыхание, медитация, дневник настроения и AI-помощник на базе КПТ.
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Дыхание</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Дневник</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">AI-КПТ</span>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-purple-600">
                Начать практику
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Secondary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/mood"
            className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              📝
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Дневник настроения</h3>
              <p className="text-sm text-gray-500">Отслеживайте эмоции</p>
            </div>
          </Link>

          <Link
            to="/progress"
            className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              📈
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Прогресс</h3>
              <p className="text-sm text-gray-500">Графики и экспорт PDF</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              📋
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">История тестов</h3>
              <p className="text-sm text-gray-500">Все ваши результаты</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="card bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Гармония тела и разума
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Почему важен комплексный подход</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Современная наука подтверждает то, что было известно ещё древним философам: <strong>тело и разум неразрывно связаны</strong>.
            Правильное питание влияет на работу мозга и эмоции. Стресс и тревога отражаются на физическом здоровье.
            А регулярные практики осознанности укрепляют и то, и другое.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Исследования показывают: люди, которые следят за питанием, на <strong>40% реже</strong> испытывают симптомы депрессии.
            А 10 минут дыхательных практик в день снижают уровень кортизола — гормона стресса — на <strong>25%</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            «Тело и Разум» объединяет три ключевых направления благополучия в одном месте:
            <span className="text-green-600 dark:text-green-400 font-medium"> контроль питания</span>,
            <span className="text-blue-600 dark:text-blue-400 font-medium"> понимание себя через тесты</span> и
            <span className="text-purple-600 dark:text-purple-400 font-medium"> практики для ежедневного баланса</span>.
          </p>
        </div>
      </section>

      {/* Psychologist Services */}
      <section className="card bg-gradient-to-r from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/20 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl">👨‍⚕️</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Консультация психолога</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Индивидуальные онлайн-консультации по методу <strong>КПТ</strong> (когнитивно-поведенческая терапия).
              Помогу разобраться с тревогой, депрессией, стрессом, самооценкой и отношениями.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Тревога</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Депрессия</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Стресс</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Самооценка</span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Отношения</span>
            </div>
          </div>
          <a
            href="https://t.me/romanskiff"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-3 px-6 py-4 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Записаться
          </a>
        </div>
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
