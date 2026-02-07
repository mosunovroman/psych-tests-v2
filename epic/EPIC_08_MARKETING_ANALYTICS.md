# EPIC 08 – Маркетинг‑аналитика и инструменты роста

## Goal
Встроить **полноценный аналитический стек** и подготовить маркетинговые материалы для привлечения клиентов:
- Отслеживание пользовательского пути (Free → Paid).  
- A/B‑тесты UI‑элементов (CTA‑кнопки, pricing‑cards).  
- Интеграция с рекламными каналами (Facebook, Google Ads).  

## Deliverables
1. **Plausible** (privacy‑first) настроен, измеряет:
   - `pageviews`, `session_duration`, `conversion_free_to_paid`.
2. **Amplitude** (или Mixpanel) – событийный трекинг:
   - `test_started`, `test_completed`, `pdf_exported`, `badge_earned`, `payment_success`.
3. **Google Tag Manager** контейнер (для ретаргетинга).  
4. **A/B‑тестинг** в React (React‑Testing‑Library + `react-ab-test` или `split.io`).  
5. **Документация**: ссылка на дашборд, примеры запросов, план отчётов (weekly, monthly).  

## Acceptance Criteria
- ✅ Plausible отображает минимум 90 % всех pageviews (настройка `allow-localhost` в dev).  
- ✅ В Amplitude видно событие `payment_success` с `user_id`.  
- ✅ A/B‑тест “Green CTA vs Blue CTA” запущен, собирает минимум 500 конверсионных действий в течение 1 недели.  
- ✅ Маркетологи получают доступ к дашбордам, ссылки в `README.md`.  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Создать аккаунт Plausible, добавить скрипт в `index.html` (async) | DevOps | 1 |
| 2 | Подключить Amplitude SDK, добавить базовые события (init, login, test_complete) | Front‑end | 4 |
| 3 | Создать GTM‑контейнер, добавить пиксели FB/Google Ads | Marketing | 3 |
| 4 | Реализовать A/B‑тестинг UI‑кнопки “Buy” (использовать `react-ab-test`) | Front‑end | 5 |
| 5 | Настроить webhook в Amplitude → Supabase (для рекламных сегментов) | Backend | 3 |
| 6 | Подготовить дашборд в Plausible + Amplitude (charts, funnels) | Marketing | 4 |
| 7 | Написать инструкцию по запуску/просмотру аналитики (README) | Docs | 2 |
| 8 | Провести первый A/B‑тест, собрать данные, подготовить отчет | Marketing/PM | 8 |
| **Итого** | | | **30 ч** |

## Dependencies
- **Epic 01** (frontend) – чтобы вставить скрипты.  
- **Epic 04** (auth) – чтобы привязывать события к `user_id`.  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| GDPR‑ограничения на отслеживание без согласия | Средний | Добавить **Cookie‑consent banner** (Сan’t‑track until opt‑in). |
| Потеря данных из‑за блокировок ad‑blocker | Низкий | Записывать основные события в локальное `localStorage` и синхронизировать позже. |

## Best‑Practice Tips
- **Plausible** уже имеет built‑in `event-goals`; используйте их для `payment_success`.  
- При A/B‑тесте фиксируйте **гипотезу** (ex: “зелёная кнопка повышает конверсию на 15 %”) и **метрику** (conversion‑rate).  
- Для ретаргетинга экспортируйте `user_id` (hashed) в **Customer‑Data‑Platform** (CDP) только после согласия.  

---  


