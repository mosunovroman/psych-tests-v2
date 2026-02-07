import { useState, useRef, useCallback, useEffect } from 'react'
import { FoodAnalysisResult } from '../../types/nutrition'
import { analyzeFood, OfflineError, AnalysisError } from '../../services/nutritionApi'

interface PhotoCaptureProps {
  onAnalysisComplete: (result: FoodAnalysisResult) => void
  onCancel: () => void
}

export default function PhotoCapture({ onAnalysisComplete, onCancel }: PhotoCaptureProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>('')
  const [showCameraStream, setShowCameraStream] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Определяем мобильное устройство
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  // Открытие камеры
  const openCameraStream = useCallback(async () => {
    // На мобильных устройствах используем нативный input с capture
    if (isMobile) {
      cameraInputRef.current?.click()
      return
    }

    // На десктопе пробуем Web API
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      })
      streamRef.current = stream
      setShowCameraStream(true)
    } catch {
      // Fallback на input
      cameraInputRef.current?.click()
    }
  }, [isMobile])

  // Подключаем поток к video элементу после рендера
  useEffect(() => {
    if (showCameraStream && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {
        // Autoplay может быть заблокирован
      })
    }
  }, [showCameraStream])

  const captureFromStream = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
        setSelectedFile(file)
        setPreview(canvas.toDataURL('image/jpeg'))
        closeCameraStream()
      }
    }, 'image/jpeg', 0.9)
  }, [])

  const closeCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCameraStream(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    // Проверяем размер (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Файл слишком большой (максимум 10MB)')
      return
    }

    setSelectedFile(file)
    setError('')

    // Создаём превью
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError('')

    try {
      const result = await analyzeFood(selectedFile, description.trim() || undefined)
      onAnalysisComplete(result)
    } catch (err) {
      if (err instanceof OfflineError) {
        setError('Нет подключения к интернету. Попробуйте позже.')
      } else if (err instanceof AnalysisError) {
        setError(err.message)
      } else {
        setError('Произошла ошибка при анализе. Попробуйте другое фото.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📸 Анализ фото еды
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              disabled={isAnalyzing}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {showCameraStream ? (
            // Прямая трансляция с камеры
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeCameraStream}
                  className="flex-1 btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={captureFromStream}
                  className="flex-1 btn-primary bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  📸 Снять
                </button>
              </div>
            </div>
          ) : !preview ? (
            // Выбор источника фото
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                AI определит продукты и рассчитает КБЖУ
              </p>

              {/* Главная кнопка — Камера (через Web API) */}
              <button
                onClick={openCameraStream}
                className="w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg active:scale-[0.98] transition-transform"
              >
                <span className="text-4xl">📷</span>
                <div className="text-left">
                  <span className="text-xl font-bold block">Сделать фото</span>
                  <span className="text-green-100 text-sm">Открыть камеру</span>
                </div>
              </button>
              {/* Резервный input для браузеров без Web API */}
              <input
                ref={cameraInputRef}
                type="file"
                capture="environment"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Второстепенная кнопка — Галерея */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
              >
                <span className="text-2xl">🖼️</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">Выбрать из галереи</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={onCancel}
                className="w-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-2"
              >
                Отмена
              </button>
            </div>
          ) : (
            // Превью и анализ
            <div className="space-y-4">
              {/* Превью изображения */}
              <div className="relative">
                <img
                  src={preview}
                  alt="Превью еды"
                  className="w-full rounded-xl object-cover max-h-64"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="font-medium">Анализируем...</p>
                      <p className="text-sm opacity-75">Определяем продукты и КБЖУ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Описание для уточнения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание (необязательно)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Например: борщ со сметаной, порция 300г"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Добавьте описание для более точного анализа
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 btn-secondary"
                  disabled={isAnalyzing}
                >
                  Другое фото
                </button>
                <button
                  onClick={handleAnalyze}
                  className="flex-1 btn-primary"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Анализ...
                    </span>
                  ) : (
                    '🔍 Анализировать'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
