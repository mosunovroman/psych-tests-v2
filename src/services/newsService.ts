export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
}

const CACHE_KEY = 'psych-news-cache'
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours
const API_URL = import.meta.env.VITE_API_URL || 'https://patient-lab-742e.rskiff-defi.workers.dev'

const SOURCE_TRANSLATIONS: Record<string, string> = {
  'Psychology Today': 'Психология сегодня',
  'ScienceDaily': 'Наука ежедневно',
  'Mind & Brain News -- ScienceDaily': 'Наука ежедневно',
  'PsyPost': 'ПсихоПост',
  'Science': 'Наука',
  'Nature': 'Nature',
  'Medical News Today': 'Медицинские новости'
}

function translateSource(source: string): string {
  return SOURCE_TRANSLATIONS[source] || source
}

async function translateSingleItem(title: string, description: string): Promise<{title: string, description: string}> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Переведи на русский язык. Отвечай ТОЛЬКО JSON объектом с полями title и description. Без markdown, без пояснений.'
        },
        {
          role: 'user',
          content: JSON.stringify({ title, description })
        }
      ],
      temperature: 0.2,
      max_tokens: 500
    })
  })

  if (!response.ok) throw new Error('API error')

  const data = await response.json()
  let text = data.choices[0].message.content.trim()

  // Remove markdown
  if (text.startsWith('```')) {
    text = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
  }

  return JSON.parse(text)
}

async function translateToRussian(newsItems: NewsItem[]): Promise<NewsItem[]> {
  if (newsItems.length === 0) return newsItems

  const translatedItems: NewsItem[] = []

  // Translate items one by one for better reliability
  for (const item of newsItems) {
    try {
      const translated = await translateSingleItem(item.title, item.description)
      translatedItems.push({
        ...item,
        title: translated.title || item.title,
        description: translated.description || item.description,
        source: translateSource(item.source)
      })
    } catch (error) {
      console.error('Translation error for item:', item.title, error)
      // Keep original with translated source
      translatedItems.push({
        ...item,
        source: translateSource(item.source)
      })
    }
  }

  return translatedItems
}

// Curated psychology news sources (RSS feeds parsed via public proxy)
const NEWS_SOURCES = [
  {
    name: 'Psychology Today',
    rssUrl: 'https://www.psychologytoday.com/intl/rss'
  },
  {
    name: 'ScienceDaily - Psychology',
    rssUrl: 'https://www.sciencedaily.com/rss/mind_brain/psychology.xml'
  }
]

// Fallback news for offline/error cases
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Медитация снижает уровень кортизола на 25%',
    description: 'Новое исследование подтвердило, что регулярная практика медитации значительно снижает уровень гормона стресса.',
    url: '#',
    source: 'Психология сегодня',
    publishedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Когнитивно-поведенческая терапия эффективна при тревоге',
    description: 'Мета-анализ 50 исследований показал высокую эффективность КПТ в лечении тревожных расстройств.',
    url: '#',
    source: 'Наука и жизнь',
    publishedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    title: 'Социальные связи влияют на продолжительность жизни',
    description: 'Учёные обнаружили, что качественные социальные отношения могут продлить жизнь на 50%.',
    url: '#',
    source: 'Здоровье',
    publishedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    title: 'Физические упражнения улучшают память',
    description: 'Аэробные нагрузки стимулируют рост гиппокампа — области мозга, отвечающей за память.',
    url: '#',
    source: 'Нейронаука',
    publishedAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    title: 'Сон критически важен для эмоциональной регуляции',
    description: 'Недостаток сна на 60% снижает способность контролировать эмоции, показало исследование.',
    url: '#',
    source: 'Сомнология',
    publishedAt: new Date(Date.now() - 345600000).toISOString()
  }
]

interface CacheData {
  news: NewsItem[]
  timestamp: number
}

function getFromCache(): NewsItem[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CacheData = JSON.parse(cached)
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data.news
  } catch {
    return null
  }
}

function saveToCache(news: NewsItem[]): void {
  try {
    const data: CacheData = {
      news,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Ignore cache errors
  }
}

async function fetchRssFeed(url: string): Promise<NewsItem[]> {
  try {
    // Use a CORS proxy for RSS feeds
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) throw new Error('Failed to fetch')

    const data = await response.json()

    if (data.status !== 'ok' || !data.items) {
      throw new Error('Invalid RSS response')
    }

    return data.items.slice(0, 5).map((item: any, index: number) => ({
      id: `${url}-${index}`,
      title: item.title || 'Без заголовка',
      description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...' || '',
      url: item.link || '#',
      source: data.feed?.title || 'Новости',
      publishedAt: item.pubDate || new Date().toISOString(),
      imageUrl: item.thumbnail || item.enclosure?.link
    }))
  } catch {
    return []
  }
}

export async function fetchPsychologyNews(): Promise<NewsItem[]> {
  // Check cache first
  const cached = getFromCache()
  if (cached && cached.length > 0) {
    return cached
  }

  // Check if online
  if (!navigator.onLine) {
    return FALLBACK_NEWS
  }

  try {
    // Fetch from multiple sources
    const allNewsPromises = NEWS_SOURCES.map(source => fetchRssFeed(source.rssUrl))
    const allNewsResults = await Promise.all(allNewsPromises)

    // Combine and sort by date
    const allNews = allNewsResults
      .flat()
      .filter(item => item.title && item.description)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10)

    if (allNews.length > 0) {
      // Translate to Russian
      const translatedNews = await translateToRussian(allNews)
      saveToCache(translatedNews)
      return translatedNews
    }

    return FALLBACK_NEWS
  } catch {
    return FALLBACK_NEWS
  }
}

export function clearNewsCache(): void {
  localStorage.removeItem(CACHE_KEY)
}

export function formatNewsDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) return 'Только что'
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}
