import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTestById } from '../mocks/testConfigs'
import { getTestQuestions, iqAnswerOptions, Question } from '../mocks/testQuestions'
import { useTestResults } from '../hooks/useTestResults'
import { getRecommendationsForTest } from '../mocks/recommendations'
import { useAchievements } from '../hooks/useAchievements'
import { NewBadgeNotification } from '../components/BadgeList'
import TherapyPrompt, { determineSeverity } from '../components/TherapyPrompt'
import { Badge } from '../services/gamificationService'
import RorschachTest, { RorschachAnalysis, RorschachResult } from '../components/RorschachTest'

interface DimensionScore {
  code: string
  name: string
  score: number
  maxScore: number
}

interface MBTIResult {
  type: string
  dimensions: {
    code: string
    preference: string
    percentA: number
    percentB: number
  }[]
}

export default function TestPage() {
  const { testId } = useParams()
  const test = testId ? getTestById(testId) : null
  const testData = testId ? getTestQuestions(testId) : null
  const { saveResult } = useTestResults()

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [resultSaved, setResultSaved] = useState(false)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  const [showTherapyPrompt, setShowTherapyPrompt] = useState(false)
  const [resultSeverity, setResultSeverity] = useState<'mild' | 'moderate' | 'severe' | null>(null)
  const [rorschachAnalysis, setRorschachAnalysis] = useState<RorschachAnalysis | null>(null)

  const { recordTest } = useAchievements()

  if (!test || !testData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Тест не найден</h2>
        <Link to="/tests" className="btn-primary">Вернуться к списку</Link>
      </div>
    )
  }

  // Handle Rorschach test separately
  if (test.testType === 'rorschach') {
    if (showResult && rorschachAnalysis) {
      return (
        <div className="animate-fade-in">
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4">
                {test.icon}
              </div>
              <h1 className="text-2xl font-bold mb-2">Результаты теста Роршаха</h1>
              {resultSaved && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Результат сохранён
                </p>
              )}
            </div>

            {/* AI Commentary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">AI-комментарий</p>
                  <p className="text-gray-700 dark:text-gray-300">{rorschachAnalysis.interpretation}</p>
                </div>
              </div>
            </div>

            <RorschachResult analysis={rorschachAnalysis} />

            <div className="mt-6">
              <ResultActions handleRetake={() => {
                setShowResult(false)
                setRorschachAnalysis(null)
                setResultSaved(false)
              }} />
            </div>
          </div>
          {newBadge && <NewBadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />}
        </div>
      )
    }

    return (
      <RorschachTest
        test={test}
        onComplete={async (_responses, analysis) => {
          setRorschachAnalysis(analysis)
          setShowResult(true)

          // Save result
          saveResult({
            testId: test.id,
            testName: test.name,
            score: analysis.totalResponses,
            maxScore: 10,
            level: 'minimal',
            title: `${analysis.totalResponses} ответов`
          })
          setResultSaved(true)

          // Record for gamification
          try {
            const result = await recordTest(test.id)
            if (result && result.newBadges && result.newBadges.length > 0) {
              setNewBadge(result.newBadges[0])
            }
          } catch (err) {
            // Gamification recording failed silently
          }
        }}
      />
    )
  }

  const { questions, options, reverseItems, scoringType } = testData

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  // Calculate standard score
  const calculateScore = (): number => {
    let total = 0
    const maxOptionValue = Math.max(...options.map(o => o.value))

    questions.forEach((q: Question, index: number) => {
      const answer = answers[q.id]
      if (answer !== undefined) {
        if (reverseItems?.includes(index + 1)) {
          total += maxOptionValue - answer
        } else {
          total += answer
        }
      }
    })
    return total
  }

  // Calculate IQ score
  const calculateIQScore = (): { correct: number; total: number; iq: number } => {
    let correct = 0
    questions.forEach((q: Question) => {
      const answer = answers[q.id]
      if (answer !== undefined && q.correctAnswer !== undefined && answer === q.correctAnswer) {
        correct++
      }
    })
    const iq = Math.round(50 + (correct / questions.length) * 100)
    return { correct, total: questions.length, iq }
  }

  // Calculate MBTI type
  const calculateMBTI = (): MBTIResult => {
    const dimensionCounts: Record<string, { a: number; b: number }> = {
      EI: { a: 0, b: 0 },
      SN: { a: 0, b: 0 },
      TF: { a: 0, b: 0 },
      JP: { a: 0, b: 0 }
    }

    questions.forEach((q: Question) => {
      const answer = answers[q.id]
      if (answer !== undefined && q.dimension) {
        if (answer === 0) {
          dimensionCounts[q.dimension].a++
        } else {
          dimensionCounts[q.dimension].b++
        }
      }
    })

    const getPreference = (dim: string): string => {
      const counts = dimensionCounts[dim]
      const total = counts.a + counts.b
      if (total === 0) return dim[0]
      return counts.a >= counts.b ? dim[0] : dim[1]
    }

    const type = getPreference('EI') + getPreference('SN') + getPreference('TF') + getPreference('JP')

    const dimensions = Object.entries(dimensionCounts).map(([code, counts]) => {
      const total = counts.a + counts.b
      return {
        code,
        preference: counts.a >= counts.b ? code[0] : code[1],
        percentA: total > 0 ? Math.round((counts.a / total) * 100) : 50,
        percentB: total > 0 ? Math.round((counts.b / total) * 100) : 50
      }
    })

    return { type, dimensions }
  }

  // Calculate multidimensional scores (Big5, EQ)
  const calculateDimensionScores = (): DimensionScore[] => {
    if (!test.dimensions) return []

    const dimensionScores: Record<string, { sum: number; count: number }> = {}
    test.dimensions.forEach(d => {
      dimensionScores[d.code] = { sum: 0, count: 0 }
    })

    questions.forEach((q: Question) => {
      const answer = answers[q.id]
      if (answer !== undefined && q.dimension && dimensionScores[q.dimension]) {
        dimensionScores[q.dimension].sum += answer
        dimensionScores[q.dimension].count++
      }
    })

    return test.dimensions.map(d => ({
      code: d.code,
      name: d.fullName,
      score: dimensionScores[d.code].sum,
      maxScore: dimensionScores[d.code].count * Math.max(...options.map(o => o.value))
    }))
  }

  const getInterpretation = (score: number) => {
    if (!test.interpretations) return null
    for (const interp of test.interpretations) {
      if (score <= interp.max) {
        return interp
      }
    }
    return test.interpretations[test.interpretations.length - 1]
  }

  // Generate AI commentary
  const generateAICommentary = (): string => {
    if (scoringType === 'mbti') {
      const mbtiResult = calculateMBTI()
      const descriptions: Record<string, string> = {
        INTJ: 'стратег с независимым мышлением и высокими стандартами',
        INTP: 'логик, любящий анализировать и находить закономерности',
        ENTJ: 'командир с природными лидерскими качествами',
        ENTP: 'изобретатель, генерирующий идеи и любящий дискуссии',
        INFJ: 'советник с глубоким пониманием людей и идеалов',
        INFP: 'посредник с богатым внутренним миром и ценностями',
        ENFJ: 'наставник, вдохновляющий и помогающий другим расти',
        ENFP: 'чемпион с энтузиазмом и творческим подходом',
        ISTJ: 'инспектор, надёжный и ответственный организатор',
        ISFJ: 'защитник, заботливый и преданный помощник',
        ESTJ: 'администратор, эффективный управленец и организатор',
        ESFJ: 'консул, гостеприимный и заботящийся о гармонии',
        ISTP: 'виртуоз, практичный и любящий разбираться в механизмах',
        ISFP: 'композитор с тонким чувством красоты и гармонии',
        ESTP: 'делец, энергичный и ориентированный на действия',
        ESFP: 'развлекатель, жизнерадостный и спонтанный'
      }
      const desc = descriptions[mbtiResult.type] || 'уникальная личность'
      return `Ваш тип личности ${mbtiResult.type} — это ${desc}. Этот результат отражает ваши предпочтения в восприятии мира и принятии решений. Помните, что типология MBTI описывает тенденции, а не ограничения.`
    }

    if (scoringType === 'iq') {
      const iqResult = calculateIQScore()
      if (iqResult.iq >= 130) return `Отличный результат! Вы показали высокий уровень логического мышления. Ваши аналитические способности позволяют эффективно решать сложные задачи.`
      if (iqResult.iq >= 110) return `Хороший результат! Ваши когнитивные способности выше среднего. Вы успешно справляетесь с логическими и аналитическими задачами.`
      if (iqResult.iq >= 90) return `Ваш результат в пределах нормы. Это означает стабильные когнитивные способности, характерные для большинства людей.`
      return `Результат ниже среднего может быть связан с усталостью или недостатком концентрации. Попробуйте пройти тест в более спокойной обстановке.`
    }

    if (test.testType === 'multidimensional') {
      const dimScores = calculateDimensionScores()
      const highDims = dimScores.filter(d => (d.score / d.maxScore) > 0.7).map(d => d.name)
      const lowDims = dimScores.filter(d => (d.score / d.maxScore) < 0.4).map(d => d.name)

      let comment = 'Результаты теста показывают вашу уникальную комбинацию качеств. '
      if (highDims.length > 0) comment += `Ваши сильные стороны: ${highDims.join(', ')}. `
      if (lowDims.length > 0) comment += `Области для развития: ${lowDims.join(', ')}. `
      return comment + 'Помните, что нет "правильного" профиля — важен баланс и осознанность.'
    }

    // Standard tests
    const score = calculateScore()
    const interp = getInterpretation(score)
    if (!interp) return ''

    if (interp.level === 'minimal') {
      return `Отличные новости! Ваши результаты показывают, что в данный момент у вас всё хорошо в этой области. Продолжайте заботиться о своём психологическом здоровье.`
    }
    if (interp.level === 'mild') {
      return `Результаты показывают небольшие признаки, на которые стоит обратить внимание. Это нормально и поправимо. Попробуйте техники самопомощи и следите за своим состоянием.`
    }
    if (interp.level === 'moderate') {
      return `Результаты указывают на умеренные проявления. Рекомендую обратить на это внимание и рассмотреть возможность консультации со специалистом. Своевременная поддержка помогает быстрее справиться.`
    }
    return `Результаты показывают выраженные проявления. Важно не игнорировать это состояние. Настоятельно рекомендую обратиться к психологу или психотерапевту для профессиональной поддержки.`
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Пожалуйста, ответьте на все вопросы')
      return
    }

    let score = 0
    let level: 'minimal' | 'mild' | 'moderate' | 'severe' = 'minimal'
    let title = ''

    if (scoringType === 'iq') {
      const iqResult = calculateIQScore()
      score = iqResult.correct
      title = `IQ: ${iqResult.iq}`
      level = iqResult.iq >= 110 ? 'minimal' : iqResult.iq >= 90 ? 'mild' : 'moderate'
    } else if (scoringType === 'mbti') {
      const mbtiResult = calculateMBTI()
      score = 0
      title = mbtiResult.type
      level = 'minimal'
    } else {
      score = calculateScore()
      const interp = getInterpretation(score)
      if (interp) {
        level = interp.level
        title = interp.title
      }
    }

    // Save result
    saveResult({
      testId: test.id,
      testName: test.name,
      score,
      maxScore: test.maxScore || questions.length,
      level,
      title
    })
    setResultSaved(true)
    setShowResult(true)

    // Record test completion for gamification
    try {
      const result = await recordTest(test.id)
      if (result && result.newBadges && result.newBadges.length > 0) {
        setNewBadge(result.newBadges[0])
      }
    } catch (err) {
      // Gamification recording failed silently
    }

    // Check if therapy prompt should be shown (only for standard tests)
    if (scoringType !== 'mbti' && scoringType !== 'iq' && test.maxScore) {
      const severity = determineSeverity(test.id, score, test.maxScore)
      if (severity === 'moderate' || severity === 'severe') {
        setResultSeverity(severity)
        setShowTherapyPrompt(true)
      }
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setShowResult(false)
    setResultSaved(false)
  }

  const levelColors: Record<string, string> = {
    minimal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    mild: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  // Result page
  if (showResult) {
    const aiCommentary = generateAICommentary()

    // MBTI result
    if (scoringType === 'mbti') {
      const mbtiResult = calculateMBTI()
      return (
        <div className="animate-fade-in">
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4">
                {test.icon}
              </div>
              <h1 className="text-2xl font-bold mb-2">Ваш тип личности</h1>
              <div className="text-6xl font-bold text-primary my-4">{mbtiResult.type}</div>
              {resultSaved && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Результат сохранён
                </p>
              )}
            </div>

            {/* Dimension bars */}
            <div className="space-y-4 mb-6">
              {mbtiResult.dimensions.map(dim => {
                const labels: Record<string, [string, string]> = {
                  EI: ['Экстраверсия (E)', 'Интроверсия (I)'],
                  SN: ['Сенсорика (S)', 'Интуиция (N)'],
                  TF: ['Мышление (T)', 'Чувство (F)'],
                  JP: ['Суждение (J)', 'Восприятие (P)']
                }
                const [labelA, labelB] = labels[dim.code] || [dim.code[0], dim.code[1]]
                return (
                  <div key={dim.code}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={dim.percentA > dim.percentB ? 'font-bold text-primary' : ''}>{labelA} {dim.percentA}%</span>
                      <span className={dim.percentB > dim.percentA ? 'font-bold text-primary' : ''}>{labelB} {dim.percentB}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                      <div className="bg-primary transition-all" style={{ width: `${dim.percentA}%` }} />
                      <div className="bg-gray-400 dark:bg-gray-500 transition-all" style={{ width: `${dim.percentB}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* AI Commentary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">AI-комментарий</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiCommentary}</p>
                </div>
              </div>
            </div>

            <ResultActions handleRetake={handleRetake} />
          </div>
          {newBadge && <NewBadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />}
        </div>
      )
    }

    // IQ result
    if (scoringType === 'iq') {
      const iqResult = calculateIQScore()
      const interp = getInterpretation(iqResult.correct)
      return (
        <div className="animate-fade-in">
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4">
                {test.icon}
              </div>
              <h1 className="text-2xl font-bold mb-2">Результаты IQ теста</h1>
              {resultSaved && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Результат сохранён
                </p>
              )}
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6 text-center">
              <div className="text-6xl font-bold text-primary mb-2">{iqResult.iq}</div>
              <div className="text-gray-500 mb-4">Оценка IQ</div>
              <div className="text-lg">Правильных ответов: {iqResult.correct} из {iqResult.total}</div>
            </div>

            {interp && (
              <div className={`rounded-lg p-4 mb-6 ${levelColors[interp.level]}`}>
                <h3 className="font-bold text-lg mb-1">{interp.title}</h3>
                <p>{interp.description}</p>
              </div>
            )}

            {/* AI Commentary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">AI-комментарий</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiCommentary}</p>
                </div>
              </div>
            </div>

            <ResultActions handleRetake={handleRetake} />
          </div>
          {newBadge && <NewBadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />}
        </div>
      )
    }

    // Multidimensional result (Big5, EQ)
    if (test.testType === 'multidimensional') {
      const dimScores = calculateDimensionScores()
      const totalScore = dimScores.reduce((sum, d) => sum + d.score, 0)
      const totalMax = dimScores.reduce((sum, d) => sum + d.maxScore, 0)

      return (
        <div className="animate-fade-in">
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4">
                {test.icon}
              </div>
              <h1 className="text-2xl font-bold mb-2">Результаты: {test.name}</h1>
              {resultSaved && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Результат сохранён
                </p>
              )}
            </div>

            {/* Overall score */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">{totalScore}</div>
              <div className="text-gray-500">из {totalMax} баллов</div>
            </div>

            {/* Dimension scores */}
            <div className="space-y-4 mb-6">
              <h3 className="font-bold text-lg">Результаты по шкалам</h3>
              {dimScores.map(dim => {
                const percent = Math.round((dim.score / dim.maxScore) * 100)
                return (
                  <div key={dim.code}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{dim.name}</span>
                      <span>{dim.score}/{dim.maxScore} ({percent}%)</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* AI Commentary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">AI-комментарий</p>
                  <p className="text-gray-700 dark:text-gray-300">{aiCommentary}</p>
                </div>
              </div>
            </div>

            <ResultActions handleRetake={handleRetake} />

            {showTherapyPrompt && resultSeverity && (
              <TherapyPrompt
                severity={resultSeverity}
                testName={test.name}
                onClose={() => setShowTherapyPrompt(false)}
              />
            )}
          </div>
          {newBadge && <NewBadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />}
        </div>
      )
    }

    // Standard result
    const score = calculateScore()
    const interpretation = getInterpretation(score)

    return (
      <div className="animate-fade-in">
        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl mx-auto mb-4">
              {test.icon}
            </div>
            <h1 className="text-2xl font-bold mb-2">Результаты: {test.name}</h1>
            {resultSaved && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Результат сохранён
              </p>
            )}
          </div>

          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-primary mb-2">{score}</div>
              <div className="text-gray-500">из {test.maxScore} баллов</div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${(score / (test.maxScore || 1)) * 100}%` }}
              />
            </div>

            {interpretation && (
              <div className={`rounded-lg p-4 ${levelColors[interpretation.level]}`}>
                <h3 className="font-bold text-lg mb-1">{interpretation.title}</h3>
                <p>{interpretation.description}</p>
              </div>
            )}
          </div>

          {/* AI Commentary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">AI-комментарий</p>
                <p className="text-gray-700 dark:text-gray-300">{aiCommentary}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {interpretation && (() => {
            const recs = getRecommendationsForTest(test.id, interpretation.level)
            if (recs.length === 0) return null
            return (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Рекомендации</h3>
                <div className="space-y-3">
                  {recs.map((rec, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          <ResultActions handleRetake={handleRetake} />

          {showTherapyPrompt && resultSeverity && (
            <TherapyPrompt
              severity={resultSeverity}
              testName={test.name}
              onClose={() => setShowTherapyPrompt(false)}
            />
          )}

          <p className="text-xs text-gray-400 mt-6 text-center">
            Этот тест не является медицинским диагнозом. При серьёзных симптомах обратитесь к специалисту.
          </p>
        </div>

        {newBadge && <NewBadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />}
      </div>
    )
  }

  // Questions page
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

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
            <p className="text-gray-500 dark:text-gray-400">{test.shortDescription}</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {test.fullDescription}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Прогресс</span>
            <span>{answeredCount} из {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question: Question, index: number) => {
            // For IQ test, use specific options per question
            const questionOptions = testId === 'iq' && iqAnswerOptions[question.id]
              ? iqAnswerOptions[question.id]
              : options

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  answers[question.id] !== undefined
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="font-medium mb-3">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  {question.text}
                </p>
                <div className={`grid gap-2 ${
                  questionOptions.length <= 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
                }`}>
                  {questionOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all text-center text-sm ${
                        answers[question.id] === option.value
                          ? 'bg-primary text-white'
                          : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleAnswer(question.id, option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={answeredCount < questions.length}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            answeredCount === questions.length
              ? 'btn-primary'
              : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
          }`}
        >
          {answeredCount === questions.length
            ? 'Получить результат'
            : `Ответьте на все вопросы (${answeredCount}/${questions.length})`
          }
        </button>
      </div>
    </div>
  )
}

// Result actions component
function ResultActions({ handleRetake }: { handleRetake: () => void }) {
  return (
    <>
      <div className="flex gap-4 mb-4">
        <button onClick={handleRetake} className="btn-secondary flex-1">
          Пройти заново
        </button>
        <Link to="/tests" className="btn-primary flex-1 text-center">
          К списку тестов
        </Link>
      </div>

      <div className="flex gap-4 text-sm justify-center">
        <Link to="/history" className="text-primary hover:underline">
          История результатов
        </Link>
        <Link to="/relax" className="text-primary hover:underline">
          Релаксация
        </Link>
      </div>
    </>
  )
}
