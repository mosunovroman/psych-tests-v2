import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMoodDiary } from '../hooks/useMoodDiary'

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊']
const moodLabels = ['Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично']

export default function MoodPage() {
  const { entries, saveEntry, deleteEntry, getTodayEntry, getAverages, defaultActivities } = useMoodDiary()
  const [showForm, setShowForm] = useState(!getTodayEntry())
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [anxiety, setAnxiety] = useState(3)
  const [note, setNote] = useState('')
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  const todayEntry = getTodayEntry()
  const averages = getAverages(7)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveEntry({
      date: new Date().toISOString(),
      mood,
      energy,
      anxiety,
      note,
      activities: selectedActivities
    })
    setShowForm(false)
    setNote('')
    setSelectedActivities([])
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>

      <h1 className="text-3xl font-bold mb-6">Дневник настроения</h1>

      {/* Stats */}
      {averages && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-3xl mb-1">{moodEmojis[Math.round(averages.mood) - 1]}</div>
            <div className="text-sm text-gray-500">Настроение</div>
            <div className="font-bold">{averages.mood.toFixed(1)}/5</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-sm text-gray-500">Энергия</div>
            <div className="font-bold">{averages.energy.toFixed(1)}/5</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-1">😰</div>
            <div className="text-sm text-gray-500">Тревога</div>
            <div className="font-bold">{averages.anxiety.toFixed(1)}/5</div>
          </div>
        </div>
      )}

      {/* Today's entry or form */}
      {todayEntry && !showForm ? (
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-bold text-lg">Сегодняшняя запись</h2>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-primary hover:underline"
            >
              Добавить ещё
            </button>
          </div>
          <div className="flex gap-6 mb-3">
            <div className="text-center">
              <div className="text-3xl">{moodEmojis[todayEntry.mood - 1]}</div>
              <div className="text-xs text-gray-500">Настроение</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">⚡</div>
              <div className="text-xs text-gray-500">{todayEntry.energy}/5</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">😰</div>
              <div className="text-xs text-gray-500">{todayEntry.anxiety}/5</div>
            </div>
          </div>
          {todayEntry.note && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">{todayEntry.note}</p>
          )}
          {todayEntry.activities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {todayEntry.activities.map(a => (
                <span key={a} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mb-6">
          <h2 className="font-bold text-lg mb-4">Как вы себя чувствуете?</h2>

          {/* Mood selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Настроение</label>
            <div className="flex justify-between">
              {moodEmojis.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMood(i + 1)}
                  className={`text-4xl p-2 rounded-lg transition-transform ${
                    mood === i + 1 ? 'scale-125 bg-primary/10' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500 mt-1">{moodLabels[mood - 1]}</div>
          </div>

          {/* Energy slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Уровень энергии: {energy}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Истощён</span>
              <span>Полон сил</span>
            </div>
          </div>

          {/* Anxiety slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Уровень тревоги: {anxiety}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={anxiety}
              onChange={(e) => setAnxiety(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Спокоен</span>
              <span>Сильная тревога</span>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Чем занимались?</label>
            <div className="flex flex-wrap gap-2">
              {defaultActivities.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedActivities.includes(activity)
                      ? 'bg-primary text-white'
                      : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/10'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Заметка (необязательно)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Что повлияло на ваше настроение сегодня?"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary outline-none transition resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            {todayEntry && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            )}
            <button type="submit" className="btn-primary flex-1">
              Сохранить
            </button>
          </div>
        </form>
      )}

      {/* History */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4">История</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Пока нет записей. Начните отслеживать своё настроение!
          </p>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 14).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 bg-surface-light dark:bg-surface-dark rounded-lg"
              >
                <div className="text-2xl">{moodEmojis[entry.mood - 1]}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{formatDate(entry.date)}</div>
                  <div className="text-xs text-gray-500 flex gap-3">
                    <span>Энергия: {entry.energy}/5</span>
                    <span>Тревога: {entry.anxiety}/5</span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                      {entry.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
