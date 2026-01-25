import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import TestsPage from './pages/TestsPage'
import TestPage from './pages/TestPage'
import RelaxPage from './pages/RelaxPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'
import AuthPage from './pages/AuthPage'
import ChatBot from './components/ChatBot'
import InstallPrompt from './components/InstallPrompt'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/tests/:testId" element={<TestPage />} />
            <Route path="/relax" element={<RelaxPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>

        <Footer />
        <ChatBot />
        <InstallPrompt />
      </div>
    </AuthProvider>
  )
}

export default App
