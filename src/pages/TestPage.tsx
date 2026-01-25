import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTestById } from '../mocks/testConfigs'
import { getTestQuestions } from '../mocks/testQuestions'
import { useTestResults } from '../hooks/useTestResults'

export default function TestPage() {
  const { testId } = useParams()
  const test = testId ? getTestById(testId) : null
  const testData = testId ? getTestQuestions(testId) : null
  const { saveResult } = useTestResults()

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [resultSaved, setResultSaved] = useState(false)

  if (!test || !testData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Тест не найден</h2>
        <Link to="/tests" className="btn-primary">Вернуться к списку</Link>
      </div>
    )
  }

  const { questions, options, reverseItems } = testData

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    let total = 0
    const maxOptionValue = Math.max(...options.map(o => o.value))

    questions.forEach((q, index) => {
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

  const getInterpretation = (score: number) => {
    for (const interp of test.interpretations) {
      if (score <= interp.max) {
        return interp
      }
    }
    return test.interpretations[test.interpretations.length - 1]
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Пожалуйста, ответьте на все вопросы')
      return
    }

    const score = calculateScore()
    const interpretation = getInterpretation(score)

    // Save result
    saveResult({
      testId: test.id,
      testName: test.name,
      score,
      maxScore: test.maxScore,
      level: interpretation.level,
      title: interpretation.title
    })
    setResultSaved(true)
    setShowResult(true)
  }

  const handleRetake = () => {
    setAnswers({})
    setShowResult(false)
    setResultSaved(false)
  }

  const score = calculateScore()
  const interpretation = getInterpretation(score)

  const levelColors = {
    minimal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    mild: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  if (showResult) {
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
                style={{ width: `${(score / test.maxScore) * 100}%` }}
              />
            </div>

            <div className={`rounded-lg p-4 ${levelColors[interpretation.level]}`}>
              <h3 className="font-bold text-lg mb-1">{interpretation.title}</h3>
              <p>{interpretation.description}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <button onClick={handleRetake} className="btn-secondary flex-1">
              Пройти заново
            </button>
            <Link to="/tests" className="btn-primary flex-1 text-center">
              К списку тестов
            </Link>
          </div>

          <Link
            to="/history"
            className="block text-center text-primary hover:underline text-sm"
          >
            Посмотреть историю результатов
          </Link>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Этот тест не является медицинским диагнозом. При серьёзных симптомах обратитесь к специалисту.
          </p>
        </div>
      </div>
    )
  }

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
          {questions.map((question, index) => (
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {options.map((option) => (
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
          ))}
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
