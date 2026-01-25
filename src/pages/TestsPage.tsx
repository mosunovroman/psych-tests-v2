import { Link } from 'react-router-dom'
import { tests } from '../mocks/testConfigs'

export default function TestsPage() {
  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Психологические тесты</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Выберите тест для прохождения
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Link
            key={test.id}
            to={`/tests/${test.id}`}
            className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition">
                {test.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{test.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {test.shortDescription}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span>{test.questions} вопросов</span>
                  <span>•</span>
                  <span>{test.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/relax" className="btn-secondary inline-flex items-center gap-2">
          <span>🧘</span>
          Релаксация и дыхательные упражнения
        </Link>
      </div>
    </div>
  )
}
