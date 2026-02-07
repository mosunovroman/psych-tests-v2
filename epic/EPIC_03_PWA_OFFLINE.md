# EPIC 03 – Превращение в Progressive Web App (offline‑first, installable)

## Goal
Запустить полностью **offline‑first PWA** в течение 2 недель, чтобы пользователь мог:
- Открыть приложение без интернета.
- Ставить “Add to Home Screen” и получать push‑уведомления.
- Работать с тестами и чат‑ботом в режиме офлайн (кеш‑ответы).

## Deliverables
1. `manifest.webmanifest` с иконками (размеры 192 px, 512 px) и названием.
2. `service-worker.js` (Workbox) с стратегией:
   - **Stale‑while‑revalidate** для статических файлов.
   - **Cache‑first** для `testConfigs.json`.
   - **Network‑only** для AI‑запросов (с fallback‑сообщением *“Нет соединения”*).
3. UI‑компонент `InstallPrompt` (на Android/Chrome) + iOS‑подсказка.
4. Push‑notification subscription flow (VAPID keys) – запрос разрешения при первом запуске.
5. Документация: как протестировать офлайн‑режим (Lighthouse PWA audit ≥ 90).

## Acceptance Criteria
- ✅ `manifest.json` корректно читается (`navigator.manifest` returns object).  
- ✅ При `navigator.serviceWorker.register` появляется SW без ошибок.  
- ✅ Приложение работает полностью после отключения сети (тесты, графики, чат‑бот с кеш‑сообщением).  
- ✅ Появляется системное окно “Add to Home Screen”.  
- ✅ Push‑notification API работает (веб‑push получен после `setTimeout`‑симуляции).  
- ✅ Lighthouse PWA score ≥ 90.

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Создать `manifest.webmanifest` + набор иконок | Front‑end/Design | 2 |
| 2 | Добавить Workbox (`workbox-cli generateSW`) и настроить стратегии | Front‑end | 5 |
| 3 | Реализовать fallback UI для AI‑запросов (offline‑message) | Front‑end | 3 |
| 4 | Добавить `InstallPrompt` компонент + iOS‑инструкцию | Front‑end | 4 |
| 5 | Сгенерировать VAPID‑ключи и написать `/api/push-subscriptions` endpoint (Cloudflare Worker) | Backend/DevOps | 6 |
| 6 | Протестировать в Chrome DevTools (offline, “Add to home”) | QA | 4 |
| 7 | Добавить Lighthouse‑audit в CI (GitHub Actions) | DevOps | 4 |
| **Итого** | | | **28 ч** |

## Dependencies
- Завершённый **Epic 01** (React‑app).  
- Публичный сертификат HTTPS (необходимо для PWAs и push).

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Пользователь может увидеть «нет сети» в чате и уйти | Средний | Показать заранее сообщение «Чат будет недоступен offline, но тесты работают» в UI. |
| Push‑notifications требуют HTTPS + VAPID; если проект размещён на бесплатных хостингах без cert, не работает | Высокий | Разместить на Cloudflare Pages (никакой отдельный сервер нужен). |

## Best‑Practice Tips
- **Asset versioning** – добавить `?v=202401` к CSS/JS в `manifest` чтобы гарантировать обновление при новых релизах.  
- **Background sync** (optional) – если в будущем понадобится отправлять результаты на сервер, включить `workbox-background-sync`.  
- **Cache‑busting** – при изменении `testConfigs.json` обновляйте `revision` в Workbox.  

---  


