import { Link } from 'react-router-dom'

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
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
            <Link to="/" className="hover:opacity-80 transition">Тесты</Link>
            <Link to="/relax" className="hover:opacity-80 transition">Релаксация</Link>
          </nav>

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
        </div>
      </div>
    </header>
  )
}
