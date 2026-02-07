# EPIC 11 – Безопасность, конфиденциальность и юридические аспекты

## Goal
Обеспечить **полноценное соответствие GDPR/CCPA** и **HIPAA‑lite** (поскольку речь о ментальном здоровье) + внедрить технические меры защиты данных и юридический disclaimer.

## Deliverables
1. **Content‑Security‑Policy** (CSP) заголовки через Cloudflare Worker (`Content-Type`, `script-src`, `style-src`, `frame‑ancestors`).  
2. **HSTS**, **X‑Content‑Type‑Options**, **Referrer‑Policy**, **Permissions‑Policy** (iframe, geolocation).  
3. **Cookie‑Consent banner** (Cookiebot‑style) – пользователь явно соглашается на аналитические/marketing‑cookies.  
4. **Privacy Policy** и **Terms of Service** (psy‑disclaimer, “не заменяет профессиональную помощь”).  
5. **Data‑Deletion endpoint** (`DELETE /user/:id`) – полностью удаляет записи из Supabase, R2 и KV.  
6. **Encryption at rest** – включить Supabase `pgcrypto` для полей `test_results.details`.  
7. **Secure headers** в Cloudflare Workers (`addEventListener('fetch' …)`).  

## Acceptance Criteria
- ✅ CSP, HSTS, X‑Content‑Type‑Options присутствуют в ответах (проверка `curl -I`).  
- ✅ Пользователь может отозвать согласие и запросить полное удаление данных – после выполнения все записи удаляются (проверка в Supabase).  
- ✅ В UI отображается **Disclaimer** на каждой странице с тестом, а также отдельный документ в `footer`.  
- ✅ Cookie‑banner блокирует аналитические скрипты до согласия (Plausible/EU‑only).  
- ✅ Тесты (integration) проверяют, что запросы без `auth` возвращают `401`.  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Сгенерировать CSP + остальные security‑headers в Cloudflare Worker (`securityHeaders.js`) | DevOps | 4 |
| 2 | Добавить hsts‑max‑age = 31536000 в Worker | DevOps | 2 |
| 3 | Реализовать Cookie‑consent компонент (Tailwind modal) + hook `useConsent` | Front‑end | 5 |
| 4 | Написать юридические документы (Privacy, Terms) – адаптировать шаблоны | PM/Legal | 6 |
| 5 | Добавить “Delete my data” кнопку в профиль → вызов `/api/deleteUser` | Front‑end | 3 |
| 6 | Реализовать `/api/deleteUser` (Supabase RPC + R2 purge) | Backend | 5 |
| 7 | Включить `pgcrypto` в Supabase, мигрировать поле `details` (encrypt) | Backend | 4 |
| 8 | Тестировать заголовки (`curl -I`) и consent flow в Cypress | QA | 6 |
| **Итого** | | | **35 ч** |

## Dependencies
- **Epic 04** (Auth) – нужен `user_id` для удаления.  
- **Epic 03** (PWA) – уже использует HTTPS, обязательный для CSP.  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Не‑полный юридический disclaimer может вести к ответственности | Высокий | Привлечь юридическую проверку (партнёр‑lawyer). |
| Пользователь может отказать в cookie‑consent, а аналитика будет сломана | Средний | Предусмотреть fallback‑analytics (anonymous aggregate). |
| Шифрование `pgcrypto` может усложнить запросы | Средний | Хранить зашифрованный JSON только в `details`, а агрегатные поля (score, date) – открытые. |

## Best‑Practice Tips
- **CSP**: `default-src 'self'; script-src 'self' 'sha256-…' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://*.cloudflare.com;`  
- **VAPID** keys для push‑уведомлений храните в **Secrets** GitHub, не в репозитории.  
- **Data‑Retention**: автоматический purge после 2 лет (Supabase `RETENTION POLICY`).  

---  


