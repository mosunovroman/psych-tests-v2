import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'pause'

interface BreathingExercise {
  id: string
  name: string
  description: string
  icon: string
  inhale: number
  hold: number
  exhale: number
  pause?: number
}

const exercises: BreathingExercise[] = [
  {
    id: '478',
    name: 'Дыхание 4-7-8',
    description: 'Техника для быстрого успокоения и засыпания',
    icon: '🌬️',
    inhale: 4,
    hold: 7,
    exhale: 8
  },
  {
    id: 'box',
    name: 'Квадратное дыхание',
    description: 'Используется Navy SEALs для контроля стресса',
    icon: '📦',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4
  },
  {
    id: 'calm',
    name: 'Успокаивающее дыхание',
    description: 'Длинный выдох активирует парасимпатику',
    icon: '🍃',
    inhale: 4,
    hold: 2,
    exhale: 6
  },
  {
    id: 'energize',
    name: 'Бодрящее дыхание',
    description: 'Короткий цикл для прилива энергии',
    icon: '⚡',
    inhale: 3,
    hold: 0,
    exhale: 3
  }
]

// Mindfulness techniques
interface MindfulnessTechnique {
  id: string
  name: string
  description: string
  icon: string
  duration: string
  steps: string[]
}

const mindfulnessTechniques: MindfulnessTechnique[] = [
  {
    id: 'body-scan',
    name: 'Сканирование тела',
    description: 'Последовательное расслабление всех частей тела',
    icon: '🧘',
    duration: '10-15 мин',
    steps: [
      'Лягте удобно, закройте глаза',
      'Сфокусируйтесь на ступнях — почувствуйте каждый палец',
      'Медленно поднимайтесь выше: голени, колени, бёдра',
      'Расслабьте живот, грудь, спину',
      'Перейдите к рукам: пальцы, ладони, предплечья, плечи',
      'Расслабьте шею, лицо, макушку',
      'Почувствуйте всё тело целиком'
    ]
  },
  {
    id: 'pmr',
    name: 'Прогрессивная мышечная релаксация',
    description: 'Метод Джекобсона: напряжение и расслабление мышц',
    icon: '💪',
    duration: '15-20 мин',
    steps: [
      'Сожмите кулаки на 5 секунд, затем расслабьте на 10 секунд',
      'Напрягите предплечья, согнув запястья — расслабьте',
      'Напрягите бицепсы — расслабьте',
      'Поднимите плечи к ушам — опустите и расслабьте',
      'Нахмурьтесь сильно — расслабьте лицо',
      'Сожмите челюсти — расслабьте',
      'Напрягите живот — расслабьте',
      'Напрягите ягодицы и бёдра — расслабьте',
      'Согните стопы на себя — расслабьте'
    ]
  },
  {
    id: 'visualization',
    name: 'Визуализация безопасного места',
    description: 'Создайте в воображении место покоя и безопасности',
    icon: '🏝️',
    duration: '5-10 мин',
    steps: [
      'Закройте глаза и дышите медленно',
      'Представьте место, где вы чувствуете себя в безопасности',
      'Это может быть пляж, лес, горы или уютная комната',
      'Добавьте детали: что вы видите вокруг?',
      'Какие звуки слышите? Пение птиц, шум волн?',
      'Какие запахи чувствуете?',
      'Ощутите температуру, текстуры',
      'Побудьте в этом месте столько, сколько нужно'
    ]
  },
  {
    id: 'leaves',
    name: 'Листья на ручье',
    description: 'ACT-техника: наблюдение за мыслями без вовлечения',
    icon: '🍂',
    duration: '5-10 мин',
    steps: [
      'Представьте спокойный ручей в лесу',
      'На воде плывут листья',
      'Когда появляется мысль — поместите её на лист',
      'Наблюдайте, как лист уплывает по течению',
      'Не пытайтесь остановить мысль или изменить её',
      'Просто отпускайте каждую мысль на листе',
      'Если отвлеклись — мягко вернитесь к ручью'
    ]
  },
  {
    id: 'rain',
    name: 'Техника RAIN',
    description: 'Осознанная работа с трудными эмоциями',
    icon: '🌧️',
    duration: '5-10 мин',
    steps: [
      'R — Recognize (Распознайте): Что я сейчас чувствую?',
      'A — Allow (Позвольте): Дайте эмоции быть, не боритесь',
      'I — Investigate (Исследуйте): Где в теле ощущается? Какие мысли?',
      'N — Non-identification (Не отождествляйтесь): Это эмоция, а не я'
    ]
  },
  {
    id: 'anchor',
    name: 'Техника якорения',
    description: 'Быстрое возвращение в момент "здесь и сейчас"',
    icon: '⚓',
    duration: '1-2 мин',
    steps: [
      'Твёрдо поставьте ноги на пол',
      'Почувствуйте, как стопы давят на поверхность',
      'Ощутите свой вес на стуле или полу',
      'Сделайте три глубоких вдоха',
      'Назовите вслух: "Я здесь, я в безопасности"'
    ]
  }
]

export default function RelaxPage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [phase, setPhase] = useState<BreathPhase>('idle')
  const [scale, setScale] = useState(1)

  const startExercise = useCallback((exercise: BreathingExercise) => {
    setActiveExercise(exercise.id)
    let cycles = 0
    const maxCycles = 5

    const runCycle = () => {
      if (cycles >= maxCycles) {
        setActiveExercise(null)
        setPhase('idle')
        setScale(1)
        return
      }

      // Inhale
      setPhase('inhale')
      setScale(1.5)

      setTimeout(() => {
        // Hold
        setPhase('hold')

        setTimeout(() => {
          // Exhale
          setPhase('exhale')
          setScale(1)

          setTimeout(() => {
            if (exercise.pause) {
              setPhase('pause')
              setTimeout(() => {
                cycles++
                runCycle()
              }, exercise.pause * 1000)
            } else {
              cycles++
              runCycle()
            }
          }, exercise.exhale * 1000)
        }, exercise.hold * 1000)
      }, exercise.inhale * 1000)
    }

    runCycle()
  }, [])

  const stopExercise = () => {
    setActiveExercise(null)
    setPhase('idle')
    setScale(1)
  }

  const phaseText: Record<BreathPhase, string> = {
    idle: 'Нажмите "Старт"',
    inhale: 'Вдох...',
    hold: 'Задержка...',
    exhale: 'Выдох...',
    pause: 'Пауза...'
  }

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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
          <span className="text-4xl">🌟</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Практики
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Инструменты самопомощи</p>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Дыхательные техники, медитации и упражнения для снятия стресса и улучшения самочувствия
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="card text-center">
            <div className="text-4xl mb-4">{exercise.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {exercise.description}
            </p>

            {/* Breathing Circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark transition-transform duration-1000 ease-in-out"
                style={{
                  transform: activeExercise === exercise.id ? `scale(${scale})` : 'scale(1)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-sm z-10">
                  {activeExercise === exercise.id ? phaseText[phase] : phaseText.idle}
                </span>
              </div>
            </div>

            {/* Timing Info */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full text-xs">
                Вдох: {exercise.inhale}с
              </span>
              <span className="px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full text-xs">
                Задержка: {exercise.hold}с
              </span>
              <span className="px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full text-xs">
                Выдох: {exercise.exhale}с
              </span>
              {exercise.pause && (
                <span className="px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full text-xs">
                  Пауза: {exercise.pause}с
                </span>
              )}
            </div>

            {activeExercise === exercise.id ? (
              <button onClick={stopExercise} className="btn-secondary w-full">
                Стоп
              </button>
            ) : (
              <button
                onClick={() => startExercise(exercise)}
                className="btn-primary w-full"
                disabled={activeExercise !== null}
              >
                Старт
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Grounding Technique */}
      <div className="card mt-6">
        <div className="text-center mb-6">
          <span className="text-4xl">🌍</span>
          <h3 className="text-lg font-semibold mt-2">Заземление 5-4-3-2-1</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Техника при панике и тревоге
          </p>
        </div>

        <div className="space-y-3">
          {[
            { num: 5, text: 'вещей, которые вы ВИДИТЕ' },
            { num: 4, text: 'звука, которые вы СЛЫШИТЕ' },
            { num: 3, text: 'ощущения, которые вы ЧУВСТВУЕТЕ телом' },
            { num: 2, text: 'запаха, которые вы ЧУВСТВУЕТЕ' },
            { num: 1, text: 'вкус, который вы ОЩУЩАЕТЕ' }
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {item.num}
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mindfulness Techniques Section */}
      <div className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Техники осознанности</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Практики для работы с мыслями и эмоциями
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mindfulnessTechniques.map((technique) => (
            <details key={technique.id} className="card group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{technique.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 group-open:text-primary transition-colors">
                      {technique.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {technique.description}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-full">
                      {technique.duration}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-3">Пошаговая инструкция:</h4>
                <ol className="space-y-2">
                  {technique.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card mt-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <h3 className="font-bold text-lg mb-4">💡 Советы для практики</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Начните с 5 минут в день — регулярность важнее длительности
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Выберите одно время для практики (утро или перед сном)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Не боритесь с мыслями — просто замечайте их и возвращайтесь к практике
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            При панике используйте быстрые техники: якорение или 5-4-3-2-1
          </li>
        </ul>
      </div>
    </div>
  )
}
