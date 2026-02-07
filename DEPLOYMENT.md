# Mind Pro - Руководство по развёртыванию

## Обзор проекта

**Mind Pro** — веб-приложение для психологического самотестирования с функциями:
- 15+ психологических тестов (PHQ-9, GAD-7, BDI-II, MBTI, Big Five, IQ и др.)
- Техники релаксации и mindfulness
- AI-чатбот на основе КПТ
- Дневник настроения
- Система достижений и стриков
- PWA с офлайн-поддержкой
- Авторизация через Supabase

## Технологический стек

- **Frontend:** React 18 + TypeScript + Vite
- **Стили:** Tailwind CSS
- **База данных:** Supabase (PostgreSQL)
- **Хостинг:** Любой статический хостинг (Vercel, Netlify, reg.ru)
- **PWA:** vite-plugin-pwa + Workbox

---

## Быстрый старт (5 минут)

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd psych-tests-v2
npm install
```

### 2. Настройка Supabase

1. Создайте проект на https://supabase.com
2. Выполните SQL в SQL Editor:

```sql
-- Таблицы
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER,
  level TEXT,
  title TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own results" ON test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own results" ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own chats" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own chats" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own chats" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
```

3. Включите Email Auth в Authentication > Providers

### 3. Настройка переменных окружения

Создайте `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-worker.workers.dev  # опционально
```

### 4. Запуск

```bash
npm run dev     # Разработка (http://localhost:3000)
npm run build   # Сборка для продакшена
npm run preview # Предпросмотр сборки
```

---

## Структура проекта

```
psych-tests-v2/
├── src/
│   ├── components/       # UI компоненты
│   │   ├── ChatBot.tsx   # AI-чатбот
│   │   ├── Header.tsx    # Шапка сайта
│   │   ├── Footer.tsx    # Подвал
│   │   └── ...
│   ├── pages/            # Страницы
│   │   ├── LandingPage.tsx
│   │   ├── TestsPage.tsx
│   │   ├── TestPage.tsx
│   │   ├── RelaxPage.tsx
│   │   ├── AuthPage.tsx
│   │   └── ...
│   ├── contexts/         # React контексты
│   │   └── AuthContext.tsx
│   ├── hooks/            # Кастомные хуки
│   │   ├── useTestResults.ts
│   │   ├── useChat.ts
│   │   └── ...
│   ├── services/         # Сервисы
│   │   ├── syncService.ts
│   │   └── ...
│   ├── mocks/            # Данные тестов
│   │   ├── testConfigs.ts
│   │   └── testQuestions.ts
│   └── lib/
│       └── supabase.ts   # Клиент Supabase
├── public/               # Статические файлы
│   ├── sitemap.xml
│   ├── robots.txt
│   └── og-image.svg
├── api/                  # PHP API (опционально)
│   ├── config.php
│   └── gamification.php
└── index.html            # Точка входа
```

---

## Добавление нового теста

### 1. Добавьте конфигурацию в `src/mocks/testConfigs.ts`:

```typescript
{
  id: 'mytest',
  name: 'Название теста',
  shortDescription: 'Краткое описание',
  fullDescription: 'Полное описание теста...',
  icon: '🧪',
  questions: 10,
  duration: '3-5 мин',
  maxScore: 30,
  testType: 'standard', // или 'multidimensional'
  answerScale: '0-3',
  scoringMethod: 'Сумма баллов',
  resultCategories: [
    { label: 'Норма', range: '0-10', min: 0, max: 10, explanation: '...', recommendations: ['...'] },
    { label: 'Средний', range: '11-20', min: 11, max: 20, explanation: '...', recommendations: ['...'] },
    { label: 'Высокий', range: '21-30', min: 21, max: 30, explanation: '...', recommendations: ['...'] }
  ],
  interpretations: [
    { max: 10, level: 'minimal', title: 'Норма', description: '...' },
    { max: 20, level: 'mild', title: 'Средний', description: '...' },
    { max: 30, level: 'severe', title: 'Высокий', description: '...' }
  ]
}
```

### 2. Добавьте вопросы в `src/mocks/testQuestions.ts`:

```typescript
mytest: {
  questions: [
    { id: 'q1', text: 'Текст первого вопроса' },
    { id: 'q2', text: 'Текст второго вопроса' },
    // ...
  ],
  options: [
    { value: 0, label: 'Никогда' },
    { value: 1, label: 'Иногда' },
    { value: 2, label: 'Часто' },
    { value: 3, label: 'Всегда' }
  ]
}
```

---

## Деплой на хостинг

### Vercel / Netlify

```bash
npm run build
# Загрузите папку dist/
```

### FTP (reg.ru и др.)

```bash
npm run build
# Загрузите содержимое dist/ в корень сайта
```

### Nginx конфиг (для SPA)

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## SEO настройки

### Уже настроено:
- Meta-теги (title, description, keywords)
- Open Graph для соцсетей
- Twitter Cards
- Schema.org разметка
- sitemap.xml
- robots.txt

### Для нового домена измените:
1. `index.html` — все URL и метатеги
2. `public/sitemap.xml` — URL страниц
3. `public/robots.txt` — URL sitemap

### Аналитика:
- Яндекс.Метрика: замените `106470906` на свой ID в index.html
- Google Analytics: добавьте свой код

---

## Безопасность

### Выполнено:
- RLS политики в Supabase
- CORS ограничен доменом
- Security headers в API
- Sourcemaps отключены в prod
- Prepared statements в PHP

### Рекомендации:
- Переместите DB credentials в env переменные
- Настройте CSP header
- Включите HTTPS
- Регулярно запускайте `npm audit`

---

## Переменные окружения

| Переменная | Описание | Обязательно |
|------------|----------|-------------|
| VITE_SUPABASE_URL | URL проекта Supabase | Да |
| VITE_SUPABASE_ANON_KEY | Публичный ключ Supabase | Да |
| VITE_API_URL | URL Cloudflare Worker (чат) | Нет |

---

## Полезные команды

```bash
npm run dev       # Запуск в режиме разработки
npm run build     # Сборка для продакшена
npm run preview   # Предпросмотр сборки
npm run lint      # Проверка кода
npm audit         # Проверка безопасности зависимостей
```

---

## Контакты

- Telegram: @romanskiff
- Сайт: https://mind-pro.online
