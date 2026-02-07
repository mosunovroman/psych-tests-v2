# Тело и Разум — Контекст проекта

## Обзор
**Название**: Тело и Разум (ранее Mind Pro)
**Домен**: https://teloirazum.ru
**Тип**: PWA-приложение для качества жизни
**Стек**: React 18 + TypeScript + Vite + Tailwind CSS

## Структура сайта

### Три основных раздела:
1. **Тело** (`/nutrition`) — питание и физическое здоровье
   - `/nutrition/calculator` — калькулятор КБЖУ (формула Mifflin-St Jeor)
   - `/nutrition/diary` — дневник питания с AI-анализом фото
   - `/nutrition/recipes` — база рецептов

2. **Разум** (`/tests`) — психологические тесты (13+ тестов)
   - PHQ-9, GAD-7, BDI-2 (клинические)
   - MBTI, Big Five, Роршах (личность)
   - IQ, EQ, EQI (когнитивные)
   - Розенберг, PSS, WHO-5 (благополучие)
   - **ChatBot** — AI-помощник на базе КПТ (только на этой странице!)

3. **Практики** (`/relax`) — инструменты самопомощи
   - Дыхательные техники (4-7-8, бокс, успокаивающее)
   - Дневник настроения (`/mood`)

### Дополнительные страницы:
- `/` — лендинг с тремя колонками (Тело/Разум/Практики)
- `/progress` — графики прогресса, экспорт PDF
- `/history` — история тестов
- `/profile` — профиль пользователя
- `/auth` — авторизация через Supabase

## Ключевые технологии

### Frontend
- **React 18** с lazy loading для всех страниц
- **TypeScript** со строгой типизацией
- **Tailwind CSS** с кастомными компонентами (btn-primary, btn-secondary, card)
- **Recharts** для графиков
- **html2pdf.js** для экспорта PDF

### PWA
- **vite-plugin-pwa** с Workbox
- Офлайн-режим с кешированием
- `skipWaiting: true`, `clientsClaim: true` для быстрого обновления

### Backend
- **Supabase** — авторизация и синхронизация данных
- **Cloudflare Worker** — API для AI-анализа
  - Endpoint: `https://patient-lab-742e.rskiff-defi.workers.dev`
  - `/chat` — ChatBot (Groq Llama)
  - `/analyze-food` — анализ фото еды (Groq Vision)

### Хранение данных
- **localStorage** — офлайн-хранение (тесты, дневник, настройки)
- **Supabase** — облачная синхронизация для авторизованных

## Деплой

### Хостинг: reg.ru
- FTP: 37.140.192.207
- User: u3391221
- Папка: `/www/teloirazum.ru`

### Команды
```bash
npm run build          # Сборка
node scripts/deploy.mjs # Деплой на teloirazum.ru
```

## Важные файлы

| Файл | Описание |
|------|----------|
| `src/App.tsx` | Роутинг, lazy loading |
| `src/components/Header.tsx` | Навигация (Тело/Разум/Практики) |
| `src/pages/LandingPage.tsx` | Главная страница |
| `src/pages/TestsPage.tsx` | Раздел "Разум" + ChatBot |
| `src/pages/NutritionPage.tsx` | Раздел "Тело" |
| `src/pages/FoodDiaryPage.tsx` | Дневник питания + фото |
| `src/components/nutrition/PhotoCapture.tsx` | Камера (Web API) |
| `src/services/nutritionApi.ts` | API анализа фото |
| `src/hooks/useNutritionDiary.ts` | Хук дневника питания |
| `scripts/deploy.mjs` | FTP-деплой |
| `vite.config.ts` | PWA-конфигурация |

## Особенности реализации

### Камера (PhotoCapture.tsx)
Использует Web Camera API (`navigator.mediaDevices.getUserMedia`) для прямого доступа к камере.
Fallback на `<input capture>` если API недоступен.
**Требует HTTPS!**

### ChatBot
- Только на странице `/tests` (Разум)
- Использует Groq Llama через Cloudflare Worker
- Промпт на основе КПТ (когнитивно-поведенческая терапия)

### Калькулятор КБЖУ
- Формула Mifflin-St Jeor
- Коэффициенты активности: 1.2 - 1.9
- Цели: похудение (-20%), поддержание, набор (+15%)

## Брендинг

- **Название**: Тело и Разум
- **Слоган**: Платформа благополучия
- **Цвета**:
  - Primary: #4a6fa5 (синий)
  - Тело: зелёный (green-500)
  - Разум: синий (blue-500)
  - Практики: фиолетовый (purple-500)

## Контакты владельца
- Telegram: @romanskiff
- Услуги: консультации психолога (КПТ)

## История изменений

### Февраль 2025
- Переименование Mind Pro → Тело и Разум
- Миграция на домен teloirazum.ru
- Добавлен раздел питания с AI-анализом фото
- Структура Тело/Разум/Практики
- ChatBot перенесён только на страницу Разум
- Исправлена работа камеры (Web API)
