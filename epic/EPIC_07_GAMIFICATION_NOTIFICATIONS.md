# EPIC 07 – Геймификация и система уведомлений (streak, бейджи, push)

## Goal
Увеличить удержание (DAU) минимум на **30 %** за 2 мес. через:
- **Streak‑система** (кол‑во consecutive дней, когда пользователь прошёл хотя бы один тест).  
- **Бейджи** за достижения («Первый тест», «10‑й тест», «30‑дневный streak»).  
- **Push‑уведомления** и **email‑напоминания** о расписании и новых контентных релизах.  

## Deliverables
1. Таблица `badges` в Supabase (badge_id, name, description, icon_url).  
2. Фронтенд‑логика `useAchievements` (React hook) → считает бейджи и streak в реальном времени.  
3. UI‑компоненты:
   - `BadgeList` (grid с иконками + tooltip).  
   - `StreakCounter` (друзья‑style).  
4. `PushNotificationService` (VAPID) + UI‑prompt “Разрешить уведомления”.  
5. Планировщик (Cloudflare Worker Cron) – каждый день в 09:00 отправляет push/email с рекомендацией “Пора пройти тест”.  

## Acceptance Criteria
- ✅ Пользователь видит свой текущий streak и открытый список бейджей в профиле.  
- ✅ При достижении нового бейджа появляется анимация/тост и запись в `user_badges` (Supabase).  
- ✅ Push‑уведомление доставляется на Chrome/Android (если разрешено) и отображается в UI.  
- ✅ Планировщик отправляет минимум 1 push/email в день активным пользователям (лог в `notifications_sent`).  
- ✅ Тесты покрывают логику расчёта streak и распределения бейджей.  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Спроектировать таблицы `badges`, `user_badges`, `notifications_sent` в Supabase | Backend | 3 |
| 2 | Реализовать `useAchievements` (calc streak, check thresholds) | Front‑end | 5 |
| 3 | Создать UI‑компоненты `BadgeList`, `StreakCounter` | Front‑end | 4 |
| 4 | Добавить анимацию (framer‑motion) для тостов | Front‑end | 3 |
| 5 | Сгенерировать VAPID‑ключи, написать `/api/push-subscriptions` endpoint | DevOps | 4 |
| 6 | Добавить prompt `Enable notifications?` после первой сессии | Front‑end | 2 |
| 7 | Планировщик Cloudflare Worker (`cron-trigger`) – отправка push/email (SendGrid) | Backend/DevOps | 6 |
| 8 | Unit‑тесты для `useAchievements` (Jest) | QA/Dev | 5 |
| 9 | Cypress сценарий: достичь 3‑дневного streak → увидеть бейдж | QA | 6 |
| **Итого** | | | **38 ч** |

## Dependencies
- **Epic 04** (Auth) – нужен `user_id` для записей бейджей.  
- **Epic 03** (PWA) – push‑notifications требуют Service Worker.  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Пользователь может отключить push‑уведомления полностью | Средний | Дублировать важные напоминания через email (opt‑in). |
| Система бейджей может вызвать “дополнительный стресс” (игровой элемент не всем подходит) | Низкий | Позволить пользователю отключить геймификацию в настройках профиля. |

## Best‑Practice Tips
- **Debounce** отправку push‑сообщений: не более 1 сообщения в 4 часа на одного пользователя.  
- Хранить **badge progress** в отдельной таблице `badge_progress` (чтобы легко добавить новые условия).  
- При расчёте streak использовать **UTC‑date**, а не локальное время клиента (чтобы избежать “перепрыгивание” по тайм‑зоне).  

---  


