# Mind Pro - Архитектура проекта

## Краткое описание для AI-ассистента

Это React/TypeScript приложение для психологического самотестирования. Основные файлы:

### Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `src/App.tsx` | Роутинг и структура приложения |
| `src/mocks/testConfigs.ts` | Конфигурации всех тестов |
| `src/mocks/testQuestions.ts` | Вопросы и варианты ответов |
| `src/pages/TestPage.tsx` | Логика прохождения теста |
| `src/pages/RelaxPage.tsx` | Техники релаксации |
| `src/contexts/AuthContext.tsx` | Авторизация Supabase |
| `src/lib/supabase.ts` | Клиент Supabase |
| `src/services/syncService.ts` | Синхронизация данных |
| `index.html` | SEO, метатеги, аналитика |

### Типы тестов

```typescript
testType: 'standard'        // Сумма баллов → уровень
testType: 'multidimensional' // Несколько шкал (Big Five)
testType: 'type-based'      // MBTI (16 типов)
testType: 'rorschach'       // Проективный тест
```

### Структура теста

```typescript
// testConfigs.ts
{
  id: string,
  name: string,
  questions: number,
  maxScore: number,
  testType: string,
  resultCategories: ResultCategory[],
  interpretations: Interpretation[]
}

// testQuestions.ts
{
  questions: Question[],
  options: AnswerOption[]
}
```

### Основные хуки

- `useAuth()` — авторизация (user, signIn, signOut)
- `useTestResults()` — результаты тестов (results, saveResult)
- `useMoodDiary()` — дневник настроения
- `useAchievements()` — достижения и стрики

### Маршруты

```
/              → LandingPage
/tests         → TestsPage (каталог)
/tests/:id     → TestPage (прохождение)
/relax         → RelaxPage
/mood          → MoodPage
/history       → HistoryPage
/progress      → ProgressPage
/auth          → AuthPage
/profile       → ProfilePage
```

### Supabase таблицы

```sql
test_results (id, user_id, test_id, test_name, score, level, created_at)
chat_sessions (id, user_id, messages, created_at)
payments (id, user_id, payment_id, amount, status)
```

### Env переменные

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_URL (опционально)
```

---

## Частые задачи

### Добавить новый тест
1. `testConfigs.ts` — конфигурация
2. `testQuestions.ts` — вопросы
3. Если нестандартный тип — обновить `TestPage.tsx`

### Добавить технику релаксации
→ `RelaxPage.tsx` — массивы `exercises` и `mindfulnessTechniques`

### Изменить SEO
→ `index.html` — метатеги, Schema.org
→ `public/sitemap.xml` — список страниц

### Обновить стили
→ `tailwind.config.js` — цвета, шрифты
→ `src/index.css` — глобальные стили

### Деплой
```bash
npm run build
# Загрузить dist/ на хостинг
```

---

## Зависимости

**Основные:**
- react, react-dom, react-router-dom
- @supabase/supabase-js
- chart.js, react-chartjs-2
- jspdf, html2canvas

**Dev:**
- vite, typescript
- tailwindcss
- vite-plugin-pwa
