import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TestConfig } from '../mocks/testConfigs'

interface RorschachResponse {
  imageId: number
  description: string
  category: number
  location: 'whole' | 'detail' | 'space'
}

interface RorschachTestProps {
  test: TestConfig
  onComplete: (responses: RorschachResponse[], analysis: RorschachAnalysis) => void
}

export interface RorschachAnalysis {
  totalResponses: number
  categoryBreakdown: Record<string, number>
  locationBreakdown: Record<string, number>
  interpretation: string
  traits: string[]
}

// Stylized inkblot SVGs
const inkblots = [
  // Card I - Bat/Butterfly
  <svg key="1" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur1"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g fill="#1a1a1a" filter="url(#blur1)">
      <ellipse cx="100" cy="100" rx="80" ry="50" />
      <ellipse cx="50" cy="80" rx="40" ry="30" />
      <ellipse cx="150" cy="80" rx="40" ry="30" />
      <ellipse cx="100" cy="130" rx="30" ry="40" />
      <circle cx="70" cy="60" r="15" />
      <circle cx="130" cy="60" r="15" />
    </g>
  </svg>,

  // Card II - Two figures
  <svg key="2" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur2"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g filter="url(#blur2)">
      <ellipse cx="60" cy="100" rx="35" ry="60" fill="#1a1a1a" />
      <ellipse cx="140" cy="100" rx="35" ry="60" fill="#1a1a1a" />
      <ellipse cx="100" cy="150" rx="25" ry="20" fill="#8b0000" />
      <circle cx="60" cy="50" r="20" fill="#1a1a1a" />
      <circle cx="140" cy="50" r="20" fill="#1a1a1a" />
      <ellipse cx="100" cy="60" rx="15" ry="25" fill="#8b0000" />
    </g>
  </svg>,

  // Card III - Two people
  <svg key="3" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur3"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g filter="url(#blur3)">
      <ellipse cx="50" cy="90" rx="30" ry="50" fill="#1a1a1a" />
      <ellipse cx="150" cy="90" rx="30" ry="50" fill="#1a1a1a" />
      <ellipse cx="100" cy="160" rx="40" ry="20" fill="#8b0000" />
      <circle cx="50" cy="40" r="15" fill="#1a1a1a" />
      <circle cx="150" cy="40" r="15" fill="#1a1a1a" />
      <ellipse cx="100" cy="90" rx="20" ry="15" fill="#1a1a1a" />
    </g>
  </svg>,

  // Card IV - Giant figure
  <svg key="4" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur4"><feGaussianBlur stdDeviation="1.5" /></filter>
    </defs>
    <g fill="#1a1a1a" filter="url(#blur4)">
      <ellipse cx="100" cy="100" rx="70" ry="80" />
      <ellipse cx="40" cy="150" rx="30" ry="40" />
      <ellipse cx="160" cy="150" rx="30" ry="40" />
      <ellipse cx="100" cy="40" rx="25" ry="30" />
      <rect x="85" y="60" width="30" height="40" rx="5" />
    </g>
  </svg>,

  // Card V - Bat/Moth
  <svg key="5" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur5"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g fill="#1a1a1a" filter="url(#blur5)">
      <ellipse cx="100" cy="100" rx="90" ry="40" />
      <polygon points="100,60 60,30 80,80" />
      <polygon points="100,60 140,30 120,80" />
      <ellipse cx="100" cy="130" rx="20" ry="30" />
    </g>
  </svg>,

  // Card VI - Animal skin
  <svg key="6" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur6"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g fill="#1a1a1a" filter="url(#blur6)">
      <ellipse cx="100" cy="120" rx="60" ry="70" />
      <rect x="90" y="30" width="20" height="60" rx="5" />
      <ellipse cx="100" cy="30" rx="15" ry="10" />
      <ellipse cx="50" cy="100" rx="20" ry="40" />
      <ellipse cx="150" cy="100" rx="20" ry="40" />
    </g>
  </svg>,

  // Card VII - Two faces
  <svg key="7" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur7"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g fill="#1a1a1a" filter="url(#blur7)">
      <ellipse cx="60" cy="80" rx="40" ry="50" />
      <ellipse cx="140" cy="80" rx="40" ry="50" />
      <ellipse cx="60" cy="150" rx="25" ry="30" />
      <ellipse cx="140" cy="150" rx="25" ry="30" />
      <ellipse cx="100" cy="100" rx="10" ry="30" fill="white" />
    </g>
  </svg>,

  // Card VIII - Animals (color)
  <svg key="8" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur8"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g filter="url(#blur8)">
      <ellipse cx="100" cy="80" rx="50" ry="40" fill="#4a90d9" />
      <ellipse cx="100" cy="140" rx="40" ry="35" fill="#f4a460" />
      <ellipse cx="40" cy="100" rx="25" ry="35" fill="#e8a0c0" />
      <ellipse cx="160" cy="100" rx="25" ry="35" fill="#e8a0c0" />
      <ellipse cx="100" cy="170" rx="30" ry="20" fill="#90ee90" />
    </g>
  </svg>,

  // Card IX - Abstract (color)
  <svg key="9" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur9"><feGaussianBlur stdDeviation="1.5" /></filter>
    </defs>
    <g filter="url(#blur9)">
      <ellipse cx="100" cy="50" rx="60" ry="35" fill="#f4a460" />
      <ellipse cx="100" cy="100" rx="50" ry="30" fill="#90ee90" />
      <ellipse cx="100" cy="160" rx="70" ry="40" fill="#e8a0c0" />
      <ellipse cx="40" cy="80" rx="20" ry="40" fill="#f4a460" />
      <ellipse cx="160" cy="80" rx="20" ry="40" fill="#f4a460" />
    </g>
  </svg>,

  // Card X - Complex (color)
  <svg key="10" viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <filter id="blur10"><feGaussianBlur stdDeviation="1" /></filter>
    </defs>
    <g filter="url(#blur10)">
      <ellipse cx="100" cy="100" rx="25" ry="30" fill="#4a90d9" />
      <ellipse cx="40" cy="60" rx="25" ry="20" fill="#f4a460" />
      <ellipse cx="160" cy="60" rx="25" ry="20" fill="#f4a460" />
      <ellipse cx="50" cy="140" rx="30" ry="25" fill="#90ee90" />
      <ellipse cx="150" cy="140" rx="30" ry="25" fill="#90ee90" />
      <ellipse cx="30" cy="100" rx="15" ry="25" fill="#e8a0c0" />
      <ellipse cx="170" cy="100" rx="15" ry="25" fill="#e8a0c0" />
      <circle cx="70" cy="100" r="15" fill="#ffff00" />
      <circle cx="130" cy="100" r="15" fill="#ffff00" />
    </g>
  </svg>
]

const categories = [
  { value: 0, label: 'Человек / часть тела', code: 'H' },
  { value: 1, label: 'Животное / насекомое', code: 'A' },
  { value: 2, label: 'Природа / пейзаж', code: 'N' },
  { value: 3, label: 'Предмет / объект', code: 'O' },
  { value: 4, label: 'Абстракция / символ', code: 'Ab' },
  { value: 5, label: 'Анатомия / рентген', code: 'An' },
  { value: 6, label: 'Движение / действие', code: 'M' },
  { value: 7, label: 'Другое', code: 'X' }
]

const locations = [
  { value: 'whole', label: 'Всё изображение целиком' },
  { value: 'detail', label: 'Отдельная деталь' },
  { value: 'space', label: 'Белое пространство' }
]

export default function RorschachTest({ test, onComplete }: RorschachTestProps) {
  const [currentCard, setCurrentCard] = useState(0)
  const [responses, setResponses] = useState<RorschachResponse[]>([])
  const [currentDescription, setCurrentDescription] = useState('')
  const [currentCategory, setCurrentCategory] = useState<number | null>(null)
  const [currentLocation, setCurrentLocation] = useState<'whole' | 'detail' | 'space'>('whole')

  const handleNext = () => {
    if (!currentDescription.trim() || currentCategory === null) {
      alert('Пожалуйста, опишите что вы видите и выберите категорию')
      return
    }

    const newResponse: RorschachResponse = {
      imageId: currentCard + 1,
      description: currentDescription,
      category: currentCategory,
      location: currentLocation
    }

    const newResponses = [...responses, newResponse]
    setResponses(newResponses)
    setCurrentDescription('')
    setCurrentCategory(null)
    setCurrentLocation('whole')

    if (currentCard < 9) {
      setCurrentCard(currentCard + 1)
    } else {
      // Complete test
      const analysis = analyzeResponses(newResponses)
      onComplete(newResponses, analysis)
    }
  }

  const progress = ((currentCard) / 10) * 100

  return (
    <div className="animate-fade-in">
      <Link to="/tests" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к тестам
      </Link>

      <div className="card max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
            {test.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{test.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Карточка {currentCard + 1} из 10</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Inkblot image */}
        <div className="bg-white rounded-xl p-8 mb-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="w-64 h-64">
            {inkblots[currentCard]}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Посмотрите на изображение и опишите, что вы видите. Нет правильных или неправильных ответов —
            опишите первое, что приходит в голову.
          </p>
        </div>

        {/* Response form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Что вы видите на этом изображении?</label>
            <textarea
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Опишите, что вы видите..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">К какой категории относится то, что вы видите?</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCurrentCategory(cat.value)}
                  className={`p-3 rounded-lg text-sm text-left transition-all ${
                    currentCategory === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Где именно вы это видите?</label>
            <div className="flex gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.value}
                  onClick={() => setCurrentLocation(loc.value as 'whole' | 'detail' | 'space')}
                  className={`flex-1 p-3 rounded-lg text-sm transition-all ${
                    currentLocation === loc.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/10'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-6 py-4 rounded-xl font-semibold text-lg btn-primary"
        >
          {currentCard < 9 ? 'Следующая карточка' : 'Завершить тест'}
        </button>
      </div>
    </div>
  )
}

function analyzeResponses(responses: RorschachResponse[]): RorschachAnalysis {
  // Count categories
  const categoryBreakdown: Record<string, number> = {}
  categories.forEach(cat => {
    categoryBreakdown[cat.label] = responses.filter(r => r.category === cat.value).length
  })

  // Count locations
  const locationBreakdown: Record<string, number> = {
    'Целое': responses.filter(r => r.location === 'whole').length,
    'Деталь': responses.filter(r => r.location === 'detail').length,
    'Пространство': responses.filter(r => r.location === 'space').length
  }

  // Generate interpretation
  const traits: string[] = []

  // Analyze category preferences
  const humanCount = responses.filter(r => r.category === 0).length
  const animalCount = responses.filter(r => r.category === 1).length
  const abstractCount = responses.filter(r => r.category === 4).length
  const movementCount = responses.filter(r => r.category === 6).length

  if (humanCount >= 3) {
    traits.push('Интерес к людям и социальным отношениям')
  }
  if (animalCount >= 4) {
    traits.push('Практичный, конкретный стиль мышления')
  }
  if (abstractCount >= 2) {
    traits.push('Склонность к абстрактному мышлению')
  }
  if (movementCount >= 2) {
    traits.push('Активное воображение и творческий потенциал')
  }

  // Analyze location preferences
  const wholeCount = responses.filter(r => r.location === 'whole').length
  const detailCount = responses.filter(r => r.location === 'detail').length

  if (wholeCount >= 7) {
    traits.push('Целостное восприятие, способность видеть общую картину')
  }
  if (detailCount >= 5) {
    traits.push('Внимание к деталям, аналитический склад ума')
  }

  // Average description length as indicator of elaboration
  const avgLength = responses.reduce((sum, r) => sum + r.description.length, 0) / responses.length
  if (avgLength > 50) {
    traits.push('Развитое вербальное выражение')
  }

  if (traits.length === 0) {
    traits.push('Сбалансированный стиль восприятия')
  }

  const interpretation = `Анализ ваших ответов показывает индивидуальные особенности восприятия. ` +
    `Вы дали ${responses.length} ответов на 10 карточек. ` +
    `Преобладающие категории: ${Object.entries(categoryBreakdown)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat, count]) => `${cat} (${count})`)
      .join(', ')}.`

  return {
    totalResponses: responses.length,
    categoryBreakdown,
    locationBreakdown,
    interpretation,
    traits
  }
}

// Result component for Rorschach
export function RorschachResult({ analysis }: { analysis: RorschachAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Category breakdown */}
      <div>
        <h3 className="font-bold text-lg mb-3">Распределение ответов по категориям</h3>
        <div className="space-y-2">
          {Object.entries(analysis.categoryBreakdown)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <div key={category} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${(count / analysis.totalResponses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Location breakdown */}
      <div>
        <h3 className="font-bold text-lg mb-3">Локализация ответов</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(analysis.locationBreakdown).map(([location, count]) => (
            <div key={location} className="bg-surface-light dark:bg-surface-dark rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-gray-500">{location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <div>
        <h3 className="font-bold text-lg mb-3">Выявленные особенности</h3>
        <div className="space-y-2">
          {analysis.traits.map((trait, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
              <span className="text-primary">*</span>
              <span>{trait}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
        <p className="text-amber-800 dark:text-amber-200 text-sm">
          Тест Роршаха — проективная методика, требующая профессиональной интерпретации.
          Данные результаты носят ознакомительный характер. Для глубокого анализа
          рекомендуется консультация квалифицированного психолога.
        </p>
      </div>
    </div>
  )
}
