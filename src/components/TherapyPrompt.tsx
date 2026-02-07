interface TherapyPromptProps {
  severity: 'mild' | 'moderate' | 'severe'
  testName: string
  onClose: () => void
  contactLink?: string
}

export default function TherapyPrompt({
  severity,
  testName,
  onClose,
  contactLink = 'https://t.me/romanskiff'
}: TherapyPromptProps) {
  const getSeverityContent = () => {
    if (severity === 'severe') {
      return {
        title: 'Важно обратить внимание',
        message: `Результаты теста "${testName}" показывают выраженные симптомы. Рекомендую обратиться к специалисту для профессиональной поддержки.`,
        bgColor: 'from-red-50 to-orange-50',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-100',
        textColor: 'text-red-800',
        buttonBg: 'bg-red-600 hover:bg-red-700'
      }
    }

    if (severity === 'moderate') {
      return {
        title: 'Стоит обратить внимание',
        message: `По результатам теста "${testName}" выявлены умеренные показатели. Работа со специалистом поможет разобраться в причинах и найти решение.`,
        bgColor: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-200',
        iconBg: 'bg-amber-100',
        textColor: 'text-amber-800',
        buttonBg: 'bg-amber-600 hover:bg-amber-700'
      }
    }

    return {
      title: 'Результаты теста',
      message: `Небольшие отклонения - это нормально. Но если вы чувствуете, что вам нужна поддержка, я всегда готова помочь.`,
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-800',
      buttonBg: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const content = getSeverityContent()

  return (
    <div className={`bg-gradient-to-br ${content.bgColor} rounded-xl p-6 border ${content.borderColor} mt-6`}>
      <div className="flex items-start gap-4">
        <div className={`${content.iconBg} p-3 rounded-full flex-shrink-0`}>
          <svg className={`w-6 h-6 ${content.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${content.textColor} mb-2`}>
            {content.title}
          </h3>
          <p className="text-gray-700 mb-4">
            {content.message}
          </p>

          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <p className="text-gray-600 text-sm mb-2">
              Я - практикующий психолог, специализирующийся на КПТ (когнитивно-поведенческой терапии).
              Провожу индивидуальные консультации онлайн.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Первичная консультация - знакомство и оценка запроса</li>
              <li>• Работа с тревогой, депрессией, стрессом</li>
              <li>• Онлайн-сессии в удобное для вас время</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={contactLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${content.buttonBg} text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Записаться на консультацию
            </a>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-white/50 transition-colors"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to determine severity from test results
export function determineSeverity(testId: string, score: number, maxScore: number): 'mild' | 'moderate' | 'severe' | null {
  const percentage = (score / maxScore) * 100

  // Different thresholds for different tests
  const thresholds: Record<string, { moderate: number; severe: number }> = {
    phq9: { moderate: 33, severe: 66 },      // 10-14 moderate, 15+ severe (out of 27)
    gad7: { moderate: 38, severe: 71 },      // 8-14 moderate, 15+ severe (out of 21)
    dass21: { moderate: 35, severe: 60 },
    pss10: { moderate: 35, severe: 55 },
    bhs: { moderate: 35, severe: 60 },
    burnout: { moderate: 40, severe: 65 },
    rosenberg: { moderate: 30, severe: 50 }, // Inverted - low score is concerning
    atq: { moderate: 40, severe: 60 }
  }

  const testThreshold = thresholds[testId]
  if (!testThreshold) return null

  // Rosenberg is inverted - lower is worse
  if (testId === 'rosenberg') {
    const invertedPercentage = 100 - percentage
    if (invertedPercentage >= testThreshold.severe) return 'severe'
    if (invertedPercentage >= testThreshold.moderate) return 'moderate'
    return null
  }

  if (percentage >= testThreshold.severe) return 'severe'
  if (percentage >= testThreshold.moderate) return 'moderate'
  return null
}
