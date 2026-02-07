# EPIC 05 – Платёжные потоки и система бронирования сессий

## Goal
Внедрить полностью автоматизированный **платёжный процесс** и **онлайн‑бронирование** к концу квартала:
- Пользователь может оплатить первую консультацию ($30 USD) и сразу выбрать время.
- Интеграция с **Stripe Checkout** + **Calendly** (или Google Calendar API) → автоматическое создание видеокомнаты (Zoom / Daily.co).
- После оплаты генерируется **unique meeting link** и отправляется на email/текст в чат‑бота.

## Deliverables
1. Stripe account + products:
   - `one‑off‑session` (price $30).
   - `subscription‑package` (optional, $100/мес) – позже.
2. Cloudflare Worker (or Supabase Edge Function) – **webhook** для:
   - Обработку `checkout.session.completed`.
   - Обновление `users.paid = true` в Supabase.
   - Генерацию Zoom‑meeting (JWT) и запись `meeting_url` в `user_sessions` table.
3. UI:
   - `PricingPage` с карточкой цены и кнопкой `Pay`.
   - `BookingPage` (Calendly embed) – доступна только после `paid = true`.
4. Email‑template (SendGrid) – подтверждение оплаты + meeting‑link.
5. Тесты (unit + e2e) для платежного flow.

## Acceptance Criteria
- ✅ Пользователь видит кнопку “Оплатить первую сессию”. После клика открывается Stripe Checkout.
- ✅ После завершения оплаты пользователь автоматически перенаправляется на `BookingPage`.
- ✅ В `Supabase` поле `paid` меняется на `true` и появляется запись `session_id`.
- ✅ Пользователь получает email с уникальным Zoom‑link (12‑часовая валидность).
- ✅ Если оплата отменена, пользователь остаётся на странице с сообщением “Оплата не завершена”.
- ✅ Тесты покрывают 90 % кода webhook + UI flow.

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Создать Stripe product + price, собрать API‑ключи | Backend | 2 |
| 2 | Настроить Supabase table `user_sessions` (session_id, meeting_url, expires_at) | Backend | 3 |
| 3 | Реализовать Cloudflare Worker `stripe-webhook.js` (verify signature, update Supabase, call Zoom API) | Backend/DevOps | 8 |
| 4 | Интегрировать Stripe Checkout в `PricingPage` (frontend) | Front‑end | 5 |
| 5 | Добавить редирект‑логіку после `success_url` → `/booking` | Front‑end | 2 |
| 6 | Встроить Calendly iframe, скрыть для не‑платных users (guard) | Front‑end | 4 |
| 7 | Реализовать Zoom JWT‑генерацию (Node‑module) и запись URL в Supabase | Backend | 6 |
| 8 | Настроить SendGrid шаблон и отправку письма из webhook | Backend | 4 |
| 9 | Написать unit‑тесты для webhook (jest + supertest) | QA/Dev | 6 |
|10| Cypress сценарий: старт → Checkout → success → booking → email check (maildev) | QA | 8 |
| **Итого** | | | **48 ч** |

## Dependencies
- **Epic 04** (Auth & Supabase) – нужен пользовательский `id`.  
- **Epic 03** (PWA) – HTTPS обязательное для Stripe.  
- **Zoom/JWT** – создать приложение в Zoom Marketplace (чтобы генерировать встречи).  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe webhook может не доставляться (firewall) | Средний | Настроить **retry** в Cloudflare Workers; логировать ошибки в Supabase `error_logs`. |
| Пользователь не получит email (spam‑фильтр) | Низкий | Добавить **in‑app notification** в чат‑бот (добавить `meeting_url` в UI). |
| Zoom‑лимит бесплатного аккаунта (100 встреч/мес) | Средний | При росте переключиться на **Daily.co** (pay‑as‑you‑go) или корпоративный Zoom. |

## Best‑Practice Tips
- **Idempotent webhook**: хранить `event.id` в `stripe_events` таблице, игнорировать повторные вызовы.  
- **Stripe Checkout Session** параметр `client_reference_id` = Supabase `user.id` – облегчает связывание.  
- **Customer‑portal** (Stripe) – добавить кнопку “Управлять подпиской” в профиль.  

---  


