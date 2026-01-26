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
    description: 'Техника для быстрого успокоения',
    icon: '🌬️',
    inhale: 4,
    hold: 7,
    exhale: 8
  },
  {
    id: 'box',
    name: 'Квадратное дыхание',
    description: 'Используется для контроля стресса',
    icon: '📦',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4
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

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Релаксация</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Дыхательные упражнения для снятия стресса
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
    </div>
  )
}
