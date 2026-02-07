# EPIC 04 – Пользовательская аутентификация и синхронизация данных

## Goal
Ввести **secure authentication** и **cloud‑storage** (Supabase) к концу месяца, чтобы пользователь мог:
- Создать/войти в аккаунт (email / Google OAuth).  
- Синхронно хранить результаты тестов, историю чата и настройки на всех устройствах.  
- При отказе от сети работать в offline‑режиме (данные в `localStorage` → при следующем соединении синхронизируются).

## Deliverables
1. Supabase проект с таблицами:
   - `users` (id, email, created_at) – auth.
   - `test_results` (user_id, test_id, score, date, details JSON).
   - `chat_history` (user_id, session_id, messages JSON).
2. Front‑end:
   - `AuthProvider` (React Context) + `useSupabaseAuth` hook.
   - UI‑страницы `SignIn`, `SignUp`, `ForgotPassword`.
   - `SyncService` – читает/пишет в Supabase, использует **offline‑first** (local ↔ remote).
3. Интеграция с существующим `localStorage` (миграция данных при логине).  
4. Тесты:
   - Unit‑тесты для `SyncService`.
   - E2E‑тесты (Cypress) – регистрация, сохранение теста, logout → login → проверка данных.

## Acceptance Criteria
- ✅ Пользователь может зарегистрироваться и авторизоваться через email или Google.  
- ✅ При авторизации все локальные результаты мигрируют в Supabase и отображаются в UI.  
- ✅ После logout и нового login данные **полностью** восстанавливаются.  
- ✅ При офлайн‑режиме пользователь может продолжать делать тесты; после восстановления сети данные автоматически синхронизируются (показывается индикатор “Sync in progress”).  
- ✅ Тесты покрывают минимум 80 % кода `SyncService`.  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Создать Supabase проект, включить Auth (email + Google) | Backend/DevOps | 3 |
| 2 | Спроектировать схему БД (SQL) и написать миграции | Backend | 4 |
| 3 | Рассмотреть RLS‑политику: каждый пользователь видит только свои записи | Backend | 3 |
| 4 | Разработать `AuthProvider` + `useSupabaseAuth` hook | Front‑end | 5 |
| 5 | Реализовать UI‑формы (SignIn/SignUp) с Tailwind | Front‑end | 5 |
| 6 | Написать `SyncService` (CRUD + offline‑queue) | Front‑end | 7 |
| 7 | Миграция существующего `localStorage` → Supabase (при первой авторизации) | Front‑end | 4 |
| 8 | Добавить UI‑индикатор синхронизации (spinner) | Front‑end | 2 |
| 9 | Unit‑тесты `SyncService` (Jest) | QA/Dev | 6 |
|10| Cypress сценарии: регистрация → тест → logout → login → verify | QA | 8 |
| **Итого** | | | **47 ч** |

## Dependencies
- **Epic 01** (фронтенд‑структура).  
- **Epic 03** (PWA) желательно уже готово, так как офлайн‑queue будет использовать IndexedDB (`localforage`).  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Пользователь может потерять данные из‑за конфликтов при синхронизации | Средний | Реализовать **optimistic UI** + версионные записи (`updated_at`) + конфликт‑решение “last write wins”. |
| Ограничения бесплатного уровня Supabase (10 k rows) | Низкий | Мониторить usage; при росте перейти на тариф‑plan. |
| Пользователь может отказаться от соц‑логина (GDPR) | Средний | Предоставить только email‑auth, скрыть Google‑кнопку в EU‑регионе. |

## Best‑Practice Tips
- **Password‑less**: включить “magic link” (email‑only) – упрощает UX.  
- Хранить **JWT** в `httpOnly` cookie (Supabase JS SDK делает это автоматически).  
- В `SyncService` использовать **`localforage`** (IndexedDB) для очереди запросов, чтобы гарантировать доставку в случае плохой связи.  

---  


