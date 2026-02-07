# EPIC 09 – Тестирование (unit, integration, e2e) и покрытие кода

## Goal
Достичь **≥ 80 % покрытие кода** тестами и обеспечить стабильный CI‑pipeline, включающий:
- Unit‑тесты (Jest + React Testing Library) для всех компонентов и сервисов.  
- Integration‑tests для API‑слоя (Supabase, Cloudflare Workers) (Supertest).  
- E2E‑тесты (Cypress) покрывающие ключевые пользовательские сценарии: прохождение теста, экспорт PDF, оплата, push‑подписка.  

## Deliverables
1. `jest.config.js` + `cypress.json` + `npm test`, `npm run cy:run`.  
2. Тест‑директория `src/__tests__` со структурой:
   - `components/…/*.test.tsx`
   - `services/…/*.test.ts`
   - `workers/…/*.test.ts`
3. CI‑pipeline в GitHub Actions:
   - `lint → test → build → deploy`.
   - При падении тестов – автоматический PR‑комментарий.  
4. **Coverage report** (`coverage/`) публикуется в PR (via `coveralls` или `codecov`).  

## Acceptance Criteria
- ✅ **Coverage** > 80 % (lines, branches) в `npm test`.  
- ✅ All critical flows pass Cypress (5 тест‑кейсов) без флатов.  
- ✅ CI полностью автоматизирован, любой push → статус “passed”/“failed”.  
- ✅ Мок‑серверы (msw) используются для API‑запросов, чтобы тесты были независимы от внешних сервисов.  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Установить Jest, RTL, Cypress, MSW, Supertest | DevOps | 2 |
| 2 | Настроить `jest.config.js` (ts‑support, mock, coverage) | DevOps | 2 |
| 3 | Написать unit‑тесты для `PdfExportButton`, `ProgressChart`, `useAuth` | QA/Dev | 8 |
| 4 | Тесты для `SyncService` (offline‑queue) с msw | QA/Dev | 6 |
| 5 | Тесты Cloudflare Worker (`stripe-webhook`, `groq-proxy`) | Backend | 6 |
| 6 | Cypress сценарии: <br>· Free test → result page <br>· Export PDF <br>· Pay → Booking <br>· Push subscription <br>· Badge unlock | QA | 10 |
| 7 | Добавить в CI: `npm run lint && npm test && npm run build && npm run cy:run` | DevOps | 3 |
| 8 | Настроить Codecov badge в README | DevOps | 1 |
| **Итого** | | | **38 ч** |

## Dependencies
- **Epic 01** (React scaffolding).  
- **Epic 04** (Supabase) – нужен мок‑сервер.  
- **Epic 05** (Stripe) – мок‑ключи.  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Тесты могут быть «флейки» из‑за сети (Groq) | Средний | Все внешние запросы мокировать (MSW). |
| Низкое покрытие из‑за сложных UI‑анимаций | Низкий | Тестировать только бизнес‑логику, а не анимации. |

## Best‑Practice Tips
- **Arrange‑Act‑Assert** pattern в unit‑тестах.  
- **Cypress “cy.intercept”** для перехвата запросов к Supabase/Stripe и возврата фиктивных ответов.  
- **Snapshot testing** только для статических UI‑частей (не для динамических графиков).  

---  


