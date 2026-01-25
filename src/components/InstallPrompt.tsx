import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem('installPromptDismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return
      }
    }

    // Check iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      // Show iOS prompt after a delay
      const timer = setTimeout(() => {
        setShowIOSPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }

    // Handle Android/Chrome install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSPrompt(false)
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  if (!showPrompt && !showIOSPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-20 md:w-80 z-40 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
            Ψ
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Установить приложение</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {isIOS
                ? 'Нажмите "Поделиться" → "На экран Домой"'
                : 'Добавьте на главный экран для быстрого доступа и работы офлайн'
              }
            </p>

            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="flex-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                >
                  Установить
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition"
              >
                {isIOS ? 'Понятно' : 'Позже'}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
