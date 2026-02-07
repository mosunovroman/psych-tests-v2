import { FoodAnalysisResult } from '../types/nutrition'

const API_URL = import.meta.env.VITE_API_URL || 'https://patient-lab-742e.rskiff-defi.workers.dev'

const FOOD_ANALYSIS_PROMPT = `Ты — эксперт по питанию и диетолог. Проанализируй фото еды и определи:
1. Название каждого блюда/продукта
2. Примерную МАССУ в граммах (оцени визуально по размеру тарелки, ложки, руки)
3. Калории (ккал)
4. Белки (г)
5. Жиры (г)
6. Углеводы (г)
7. Гликемический индекс (ГИ) — число от 0 до 100

Ответь ТОЛЬКО в JSON формате без дополнительного текста:
{
  "foods": [
    {"name": "название", "portion": "150г", "weight": 150, "calories": число, "protein": число, "fat": число, "carbs": число, "glycemicIndex": число, "confidence": 0.0-1.0}
  ],
  "totalCalories": число,
  "totalProtein": число,
  "totalFat": число,
  "totalCarbs": число,
  "averageGI": число
}

Правила:
- ОБЯЗАТЕЛЬНО укажи массу в граммах (weight) для каждого продукта
- Оценивай массу по визуальным ориентирам: тарелка ~25см, ложка столовая ~15мл, кулак ~100г
- В portion укажи массу текстом, например "150г" или "200мл"
- Будь реалистичен в оценках калорийности
- Если видишь несколько продуктов — перечисли все
- confidence: 0.9+ для очевидных блюд, 0.5-0.8 для неопределённых
- glycemicIndex: низкий <55, средний 55-69, высокий 70+
- averageGI: средневзвешенный ГИ всех продуктов по углеводам
- Ответ только на русском языке`

export class OfflineError extends Error {
  constructor(message: string = 'Нет подключения к интернету') {
    super(message)
    this.name = 'OfflineError'
  }
}

export class AnalysisError extends Error {
  constructor(message: string = 'Ошибка анализа изображения') {
    super(message)
    this.name = 'AnalysisError'
  }
}

/**
 * Сжимает изображение до максимального размера
 * Автоматически уменьшает качество если файл слишком большой
 */
async function compressImage(file: File): Promise<string> {
  const MAX_SIZE_KB = 200 // Максимум 200KB для API (мобильный интернет)
  const MAX_DIMENSION = 800 // Максимальная сторона

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Масштабируем если слишком большое
        const maxDim = Math.max(width, height)
        if (maxDim > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / maxDim
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Пробуем разные уровни качества пока не уложимся в лимит
        let quality = 0.8
        let base64 = ''

        while (quality > 0.1) {
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          base64 = dataUrl.split(',')[1]
          const sizeKB = (base64.length * 3) / 4 / 1024

          // Debug: Image compressed ${width}x${height}, quality=${quality.toFixed(2)}, size=${sizeKB.toFixed(0)}KB

          if (sizeKB <= MAX_SIZE_KB) {
            break
          }
          quality -= 0.15
        }

        // Если всё ещё большое - уменьшаем размеры
        if ((base64.length * 3) / 4 / 1024 > MAX_SIZE_KB) {
          const smallerCanvas = document.createElement('canvas')
          const newWidth = Math.round(width * 0.5)
          const newHeight = Math.round(height * 0.5)
          smallerCanvas.width = newWidth
          smallerCanvas.height = newHeight
          const smallCtx = smallerCanvas.getContext('2d')
          if (smallCtx) {
            smallCtx.drawImage(canvas, 0, 0, newWidth, newHeight)
            const dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.7)
            base64 = dataUrl.split(',')[1]
            // Debug: Image resized to ${newWidth}x${newHeight}
          }
        }

        resolve(base64)
      }
      img.onerror = () => reject(new Error('Не удалось загрузить изображение'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })
}

/**
 * Парсит JSON из ответа AI, который может содержать markdown
 */
function parseAIResponse(content: string): FoodAnalysisResult {
  // AI response received

  // Убираем markdown code blocks если есть
  let jsonStr = content.trim()

  // Убираем ```json ... ``` или ``` ... ```
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim()
  }

  // Пробуем найти JSON объект в тексте (нежадный поиск первого полного объекта)
  const jsonMatch = jsonStr.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  }

  try {
    const result = JSON.parse(jsonStr)
    // Проверяем структуру ответа
    if (!result.foods || !Array.isArray(result.foods)) {
      // Если AI вернул что-то другое, пробуем адаптировать
      if (result.name && result.calories !== undefined) {
        // Единичный продукт
        return {
          foods: [{
            name: result.name,
            portion: result.portion || '1 порция',
            calories: result.calories || 0,
            protein: result.protein || 0,
            fat: result.fat || 0,
            carbs: result.carbs || 0,
            glycemicIndex: result.glycemicIndex,
            confidence: result.confidence || 0.8
          }],
          totalCalories: result.calories || 0,
          totalProtein: result.protein || 0,
          totalFat: result.fat || 0,
          totalCarbs: result.carbs || 0,
          averageGI: result.glycemicIndex
        }
      }
      throw new AnalysisError('Некорректный формат ответа AI')
    }
    return result
  } catch (e) {
    // JSON parse error
    throw new AnalysisError('Не удалось распознать ответ AI. Попробуйте другое фото.')
  }
}

/**
 * Анализирует фото еды с помощью Groq Vision API
 * @param imageFile - файл изображения
 * @param description - опциональное описание для уточнения анализа
 */
export async function analyzeFood(imageFile: File, description?: string): Promise<FoodAnalysisResult> {
  if (!navigator.onLine) {
    throw new OfflineError()
  }

  try {
    // Сжимаем изображение
    const base64Image = await compressImage(imageFile)

    // Отправляем на API с таймаутом
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000) // 60 секунд таймаут

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            { role: 'system', content: FOOD_ANALYSIS_PROMPT },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: description
                    ? `Проанализируй эту еду. Дополнительная информация от пользователя: "${description}"`
                    : 'Проанализируй эту еду:'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      })
      clearTimeout(timeout)

      // Response received
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        // API error occurred
        throw new AnalysisError(error.message || `Ошибка API: ${response.status}`)
      }

      const data = await response.json()

      if (!data.choices?.[0]?.message?.content) {
        throw new AnalysisError('Пустой ответ от API')
      }

      const result = parseAIResponse(data.choices[0].message.content)

      // Валидация результата
      if (!result.foods || !Array.isArray(result.foods)) {
        throw new AnalysisError('Некорректный формат ответа')
      }

      return result
    } catch (fetchError) {
      clearTimeout(timeout)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new AnalysisError('Превышено время ожидания. Попробуйте ещё раз.')
      }
      throw fetchError
    }
  } catch (error) {
    if (error instanceof OfflineError || error instanceof AnalysisError) {
      throw error
    }
    // Более детальная диагностика ошибок
    if (error instanceof TypeError) {
      // Network error
      throw new AnalysisError('Ошибка сети. Проверьте интернет и попробуйте снова.')
    }
    if (error instanceof Error) {
      throw new AnalysisError(error.message)
    }
    throw new AnalysisError('Неизвестная ошибка')
  }
}
