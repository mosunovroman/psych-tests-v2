import { Badge } from '../services/gamificationService'

interface BadgeListProps {
  badges: Badge[]
  showAll?: boolean
  compact?: boolean
}

export default function BadgeList({ badges, showAll = false, compact = false }: BadgeListProps) {
  const displayBadges = showAll ? badges : badges.filter(b => b.earned)

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="text-4xl block mb-2">🎯</span>
        <p>Пока нет достижений</p>
        <p className="text-sm">Пройдите тесты, чтобы получить значки!</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {displayBadges.slice(0, 5).map((badge) => (
          <div
            key={badge.code}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
              badge.earned
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-400'
            }`}
            title={badge.name}
          >
            <span>{badge.icon}</span>
            <span className="hidden sm:inline">{badge.name}</span>
          </div>
        ))}
        {displayBadges.length > 5 && (
          <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
            +{displayBadges.length - 5}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {displayBadges.map((badge) => (
        <div
          key={badge.code}
          className={`relative p-4 rounded-xl text-center transition-all ${
            badge.earned
              ? 'bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 shadow-sm'
              : 'bg-gray-100 border-2 border-gray-200 opacity-60'
          }`}
        >
          <span className={`text-4xl block mb-2 ${!badge.earned && 'grayscale'}`}>
            {badge.icon}
          </span>
          <h4 className={`font-semibold text-sm ${badge.earned ? 'text-gray-800' : 'text-gray-500'}`}>
            {badge.name}
          </h4>
          <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
            {badge.description}
          </p>

          {badge.earned && badge.earned_at && (
            <div className="mt-2 text-xs text-primary-600">
              {new Date(badge.earned_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
              })}
            </div>
          )}

          {!badge.earned && badge.threshold && badge.category && (
            <div className="mt-2 text-xs text-gray-400">
              {badge.category === 'tests' && `${badge.threshold} тестов`}
              {badge.category === 'streak' && `${badge.threshold} дней`}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// New badge notification component
interface NewBadgeNotificationProps {
  badge: Badge
  onClose: () => void
}

export function NewBadgeNotification({ badge, onClose }: NewBadgeNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-bounce-in shadow-2xl">
        <div className="text-6xl mb-4">{badge.icon}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Новое достижение!</h2>
        <h3 className="text-xl font-semibold text-primary-600 mb-2">{badge.name}</h3>
        <p className="text-gray-600 mb-6">{badge.description}</p>
        <button
          onClick={onClose}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Отлично!
        </button>
      </div>
    </div>
  )
}
