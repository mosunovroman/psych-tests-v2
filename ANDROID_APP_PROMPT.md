# Промпт для создания Android-приложения "Тело и Разум"

## Задача
Создай Android-приложение на React Native (Expo) с тем же функционалом, что и веб-сайт teloirazum.ru. Приложение должно компилироваться в APK для Android.

---

## Информация о проекте

### Название и брендинг
- **Название**: Тело и Разум
- **Package name**: `ru.teloirazum.app`
- **Цвета**:
  - Primary: #4a6fa5 (синий)
  - Тело: #22c55e (зелёный)
  - Разум: #3b82f6 (синий)
  - Практики: #a855f7 (фиолетовый)
- **Иконка**: использовать эмодзи ✨ или создать SVG

---

## Структура приложения

### Навигация (Bottom Tabs)
```
[🥗 Тело] [🧠 Разум] [🌟 Практики] [👤 Профиль]
```

### Экраны

#### 1. Тело (Nutrition)
- **NutritionHome** — хаб раздела с 3 карточками
- **KBJUCalculator** — калькулятор КБЖУ
  - Поля: пол, возраст, рост, вес, активность, цель
  - Формула Mifflin-St Jeor
  - Сохранение в AsyncStorage
- **FoodDiary** — дневник питания
  - Список записей по дням
  - Добавление: фото + описание
  - AI-анализ фото через API
  - Прогресс-бары КБЖУ за день
- **Recipes** — база рецептов (20-30 шт.)
  - Фильтр по категориям
  - Избранное

#### 2. Разум (Tests)
- **TestsList** — список 13+ тестов
- **TestScreen** — прохождение теста
  - Вопросы с вариантами ответов
  - Прогресс-бар
  - Результат с интерпретацией
- **ChatBot** — AI-помощник (только здесь!)
  - Floating button внизу справа
  - Модальное окно чата
  - API: Cloudflare Worker

#### 3. Практики (Relax)
- **RelaxHome** — список практик
- **BreathingExercise** — дыхательные упражнения
  - 4-7-8, Бокс-дыхание, Успокаивающее
  - Анимированный круг
  - Вибрация на переходах
- **MoodDiary** — дневник настроения
  - Выбор эмодзи настроения
  - Заметка
  - История по дням

#### 4. Профиль
- **Profile** — настройки и данные
- **Progress** — графики прогресса
- **History** — история тестов
- **Auth** — авторизация (Supabase)

---

## API Endpoints

### Cloudflare Worker
Base URL: `https://patient-lab-742e.rskiff-defi.workers.dev`

#### POST /chat
```json
{
  "messages": [
    {"role": "user", "content": "Привет"}
  ]
}
```

#### POST /analyze-food
```json
{
  "image": "base64_encoded_image",
  "description": "optional description"
}
```
Response:
```json
{
  "foods": [
    {
      "name": "Борщ",
      "portion": "300г",
      "calories": 150,
      "protein": 8,
      "fat": 5,
      "carbs": 18
    }
  ],
  "totalCalories": 150,
  "totalProtein": 8,
  "totalFat": 5,
  "totalCarbs": 18
}
```

### Supabase
- URL: из переменных окружения
- Auth: email/password
- Таблицы: nutrition_entries, test_results, mood_entries

---

## Данные тестов

### Список тестов (testConfigs)
```typescript
const tests = [
  // Клинические
  { id: 'phq9', name: 'PHQ-9', icon: '😔', questions: 9, category: 'clinical' },
  { id: 'gad7', name: 'GAD-7', icon: '😰', questions: 7, category: 'clinical' },
  { id: 'bdi2', name: 'BDI-II', icon: '📊', questions: 21, category: 'clinical' },

  // Личность
  { id: 'mbti', name: 'MBTI', icon: '🎭', questions: 20, category: 'personality' },
  { id: 'big5', name: 'Big Five', icon: '⭐', questions: 25, category: 'personality' },
  { id: 'rorschach', name: 'Роршах', icon: '🦋', questions: 10, category: 'personality' },

  // Когнитивные
  { id: 'iq', name: 'IQ тест', icon: '🧩', questions: 15, category: 'cognitive' },
  { id: 'eq', name: 'EQ тест', icon: '❤️', questions: 20, category: 'cognitive' },

  // Благополучие
  { id: 'rosenberg', name: 'Самооценка', icon: '💪', questions: 10, category: 'wellbeing' },
  { id: 'pss', name: 'Стресс PSS', icon: '😤', questions: 10, category: 'wellbeing' },
  { id: 'who5', name: 'WHO-5', icon: '😊', questions: 5, category: 'wellbeing' },
]
```

---

## Формула КБЖУ (Mifflin-St Jeor)

```typescript
// BMR (базовый метаболизм)
const bmr = gender === 'male'
  ? 10 * weight + 6.25 * height - 5 * age + 5
  : 10 * weight + 6.25 * height - 5 * age - 161

// Коэффициенты активности
const activityMultipliers = {
  sedentary: 1.2,      // Сидячий
  light: 1.375,        // Лёгкая активность
  moderate: 1.55,      // Умеренная
  active: 1.725,       // Высокая
  veryActive: 1.9      // Очень высокая
}

// Калории с учётом цели
const goalMultipliers = {
  lose: 0.8,           // Похудение -20%
  maintain: 1.0,       // Поддержание
  gain: 1.15           // Набор +15%
}

// БЖУ
const protein = weight * 2        // 2г на кг
const fat = calories * 0.25 / 9   // 25% калорий
const carbs = (calories - protein * 4 - fat * 9) / 4
```

---

## Хранение данных

### AsyncStorage (локально)
```typescript
// Ключи
'@kbju_profile'      // Профиль КБЖУ
'@food_entries'      // Записи питания
'@test_results'      // Результаты тестов
'@mood_entries'      // Дневник настроения
'@favorite_recipes'  // Избранные рецепты
'@user_settings'     // Настройки
```

---

## Технические требования

### Expo/React Native
```bash
npx create-expo-app teloirazum-app --template blank-typescript
cd teloirazum-app

# Установить зависимости
npx expo install expo-camera expo-image-picker expo-haptics
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @supabase/supabase-js
npx expo install react-native-chart-kit react-native-svg
npx expo install @react-native-async-storage/async-storage
```

### Структура проекта
```
src/
├── screens/
│   ├── nutrition/
│   │   ├── NutritionHome.tsx
│   │   ├── KBJUCalculator.tsx
│   │   ├── FoodDiary.tsx
│   │   └── Recipes.tsx
│   ├── tests/
│   │   ├── TestsList.tsx
│   │   ├── TestScreen.tsx
│   │   └── ChatBot.tsx
│   ├── relax/
│   │   ├── RelaxHome.tsx
│   │   ├── BreathingExercise.tsx
│   │   └── MoodDiary.tsx
│   └── profile/
│       ├── Profile.tsx
│       ├── Progress.tsx
│       └── History.tsx
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   └── MacroCircle.tsx
├── hooks/
│   ├── useNutritionDiary.ts
│   ├── useTestResults.ts
│   └── useMoodDiary.ts
├── services/
│   ├── api.ts
│   └── storage.ts
├── data/
│   ├── tests/
│   └── recipes.ts
├── types/
│   └── index.ts
└── navigation/
    └── AppNavigator.tsx
```

### app.json (Expo)
```json
{
  "expo": {
    "name": "Тело и Разум",
    "slug": "teloirazum",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4a6fa5"
    },
    "android": {
      "package": "ru.teloirazum.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4a6fa5"
      },
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE"]
    },
    "plugins": [
      "expo-camera",
      "expo-image-picker"
    ]
  }
}
```

---

## Сборка APK

```bash
# Установить EAS CLI
npm install -g eas-cli

# Логин
eas login

# Настроить проект
eas build:configure

# Собрать APK (preview)
eas build -p android --profile preview

# Или локально (требует Android SDK)
npx expo run:android --variant release
```

### eas.json
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## Важные особенности

1. **Камера**: использовать expo-image-picker с опцией камеры
2. **Вибрация**: expo-haptics для дыхательных упражнений
3. **Офлайн**: все данные в AsyncStorage, синхронизация при подключении
4. **Тёмная тема**: автоопределение через useColorScheme()
5. **ChatBot**: только на экране Tests, floating button

---

## Приоритет разработки

1. Навигация и базовая структура
2. Раздел "Разум" (тесты) — основной функционал
3. Раздел "Тело" (питание + камера)
4. Раздел "Практики" (дыхание + дневник)
5. Профиль и синхронизация
6. Полировка UI и тестирование
7. Сборка APK

---

## Контакт
Telegram: @romanskiff
