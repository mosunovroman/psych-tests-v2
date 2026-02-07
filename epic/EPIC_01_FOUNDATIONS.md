# EPIC 01 – Фундаментальная архитектура (модульность, роутинг, UI‑ядро)

## Цель
Переписать текущий однофайловый SPA в **компонентный, масштабируемый стек** (React + Vite + Tailwind) за 2 недели, чтобы обеспечить:
- Чистую разделённую код‑базу.
- Возможность добавлять новые тесты и функции без риска поломать существующее приложение.
- Подготовку к дальнейшему внедрению BFF/Backend‑as‑a‑Service.

## Deliverables
1. Репозиторий с веткой `dev` и базовой конфигурацией Vite.
2. Основные папки: `src/components`, `src/pages`, `src/hooks`, `src/services`, `src/assets`.
3. Компоненты:
   - `Header`, `Footer`, `DarkModeToggle`.
   - `TestList`, `TestCard`.
   - `ChatBot`, `ChatMessage`.
   - `RelaxationWidget`.
4. Router (React‑Router‑Dom) с роутами: `/`, `/tests/:id`, `/relax`, `/chat`.
5. Структурированный `theme` (Tailwind config + dark‑mode class).
6. CI (ESLint + Prettier) + базовые unit‑тесты (Jest) для каждого компонента.

## Acceptance Criteria
- ✅ `npm run dev` поднимает приложение без ошибок в консоли.
- ✅ Все старые 9 тестов доступны и работают в новой структуре.
- ✅ UI полностью адаптивен (mobile ≤ 375 px, desktop ≥ 1024 px) и поддерживает автотёмную тему.
- ✅ Компоненты покрыты минимумом 80 % строк тестами (`npm test` проходит).
- ✅ Сборка `npm run build` создаёт `dist/` минимум 200 KB (gzip) без предупреждений.

## Tasks
| № | Описание | Assignee | Est. (ч) |
|---|----------|----------|----------|
| 1 | Инициализация Vite + React + TypeScript + Tailwind | Front‑end Lead | 4 |
| 2 | Настройка ESLint/Prettier + Husky pre‑commit hooks | Front‑end | 2 |
| 3 | Создать роутер & базовые лэйаут‑компоненты | Front‑end | 6 |
| 4 | Перенести `index.html` → `App.tsx` (Header/Footer) | Front‑end | 4 |
| 5 | Ре‑факторинг тест‑карты (`TestCard.tsx`) | Front‑end | 5 |
| 6 | Перенести чат‑бот (`ChatBot.tsx`) + запросы к Cloudflare Worker | Front‑end | 5 |
| 7 | Добавить мок‑данные в `src/mocks` (testConfigs) | Front‑end | 3 |
| 8 | Писать unit‑тесты для новых компонентов | QA/Dev | 8 |
| 9 | CI pipeline (GitHub Actions) – lint → test → build → deploy (Pages) | DevOps | 6 |
| **Итого** | | | **43 ч** |

## Dependencies
- Никакие (самостоятельный старт).  
- Поставить **Node ≥ 18**.

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Команда не знакома с React | Средний | Провести 2‑дневный internal‑bootcamp, примеры из `create‑react‑app`. |
| Переписывание может «сломать» старый функционал | Высокий | Наличие полной **E2E‑спека** (Cypress) до начала миграции; ветка `dev` → merge only after passing tests. |
| Плохая типизация в TS | Средний | Включить строгий режим `strict: true`, писать типы для `testConfigs`. |

## Best‑Practice Tips
- **Atomic Design** – разбивать UI на atoms → molecules → organisms.
- Использовать **CSS‑variables** из Tailwind для тем (light/dark) → проще менять в runtime.
- Писать **custom hooks** (`useLocalStorage`, `useChat`) – упрощает тестирование.
- Не хранить бизнес‑логику в компонентах – вынести в `src/services/*` (например, `api.ts`).

---  


