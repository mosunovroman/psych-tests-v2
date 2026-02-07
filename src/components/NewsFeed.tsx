import { useState, useEffect } from 'react'
import { fetchPsychologyNews, formatNewsDate, clearNewsCache, NewsItem } from '../services/newsService'

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async (forceRefresh = false) => {
    setLoading(true)
    setError(false)
    if (forceRefresh) {
      clearNewsCache()
    }
    try {
      const items = await fetchPsychologyNews()
      setNews(items)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Не удалось загрузить новости</p>
        <button
          onClick={() => loadNews()}
          className="mt-2 text-primary hover:underline text-sm"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {news.slice(0, 5).map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex gap-4">
            {item.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>{item.source}</span>
                <span>•</span>
                <span>{formatNewsDate(item.publishedAt)}</span>
              </div>
            </div>
          </div>
        </a>
      ))}

      <div className="text-center pt-2">
        <button
          onClick={() => loadNews(true)}
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить и перевести
        </button>
      </div>
    </div>
  )
}
