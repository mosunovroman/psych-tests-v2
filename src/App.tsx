import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const TestsPage = lazy(() => import('./pages/TestsPage'))
const TestPage = lazy(() => import('./pages/TestPage'))
const RelaxPage = lazy(() => import('./pages/RelaxPage'))
const MoodPage = lazy(() => import('./pages/MoodPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NutritionPage = lazy(() => import('./pages/NutritionPage'))
const KBJUCalculatorPage = lazy(() => import('./pages/KBJUCalculatorPage'))
const FoodDiaryPage = lazy(() => import('./pages/FoodDiaryPage'))
const RecipesPage = lazy(() => import('./pages/RecipesPage'))

// Lazy load heavy components
const InstallPrompt = lazy(() => import('./components/InstallPrompt'))

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Loading spinner for lazy components
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

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
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tests" element={<TestsPage />} />
                <Route path="/tests/:testId" element={<TestPage />} />
                <Route path="/relax" element={<RelaxPage />} />
                <Route path="/mood" element={<MoodPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* Nutrition Section */}
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/nutrition/calculator" element={<KBJUCalculatorPage />} />
                <Route path="/nutrition/diary" element={<FoodDiaryPage />} />
                <Route path="/nutrition/recipes" element={<RecipesPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
        <Suspense fallback={null}>
          <InstallPrompt />
        </Suspense>
      </div>
    </AuthProvider>
  )
}

export default App
