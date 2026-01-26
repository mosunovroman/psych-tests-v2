import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const { user, signOut, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowMenu(false)
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-br from-primary via-primary-dark to-[#1a365d] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-pulse" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-2xl font-serif font-bold">Ψ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Mind Pro</h1>
              <p className="text-sm opacity-90">Психологические тесты</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/tests" className="hover:opacity-80 transition">Тесты</Link>
            <Link to="/relax" className="hover:opacity-80 transition">Релаксация</Link>
            <Link to="/mood" className="hover:opacity-80 transition">Дневник</Link>
            <Link to="/progress" className="hover:opacity-80 transition">Прогресс</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label="Переключить тему"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isConfigured && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        {user.email}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Мой профиль
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        История тестов
                      </Link>
                      <Link
                        to="/mood"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Дневник настроения
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Мой прогресс
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
                >
                  Войти
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
