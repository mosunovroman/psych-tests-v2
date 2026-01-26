const API_URL = import.meta.env.VITE_API_URL || 'https://patient-lab-742e.rskiff-defi.workers.dev'

const SYSTEM_PROMPT = `Ты — психологический помощник на сайте с тестами и инструментами КПТ. Твоя задача — провести первоначальную диагностику и порекомендовать подходящие тесты.

ДОСТУПНЫЕ ТЕСТЫ:
- PHQ-9 — депрессия
- GAD-7 — тревожность
- PSS-10 — стресс
- DASS-21 — комплексный (депрессия + тревога + стресс)
- Розенберг — самооценка
- Выгорание — профессиональное истощение
- ATQ — автоматические мысли
- Когнитивные искажения
- BHS — безнадёжность

ПРАВИЛА:
1. Веди себя тепло и эмпатично
2. Задавай 2-3 уточняющих вопроса
3. Рекомендуй 1-3 подходящих теста
4. Отвечай на русском
5. Будь краток — 3-4 предложения
6. Ты не врач — при серьёзных симптомах рекомендуй специалиста`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export class OfflineError extends Error {
  constructor(message: string = 'Нет подключения к интернету') {
    super(message)
    this.name = 'OfflineError'
  }
}

export const chatService = {
  async send(messages: Message[]): Promise<string> {
    // Check if online
    if (!navigator.onLine) {
      throw new OfflineError()
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-10)
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (data.error) {
          throw new OfflineError(data.message)
        }
        throw new Error('API error')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      if (error instanceof OfflineError) {
        throw error
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new OfflineError()
      }
      throw error
    }
  }
}
