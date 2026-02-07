# EPIC 12 – Техническая и пользовательская документация

## Goal
Создать **полноценный набор docs**:
- **Developer Handbook** (setup, architecture, CI/CD, testing, security).  
- **API reference** (Supabase RPC, Cloudflare Workers).  
- **User Guide** (как пройти тест, экспортировать PDF, оформить оплату).  
- **FAQ** и **Troubleshooting** (offline, push‑issues, payment failures).

## Deliverables
1. `docs/` директория:
   - `README.md` (главный, с badge‑состоянием).  
   - `GETTING_STARTED.md` (install, `npm i`, `npm run dev`).  
   - `ARCHITECTURE.md` (рисунки, диаграммы, Mermaid).  
   - `API.md` (Supabase tables, endpoints, webhook payloads).  
   - `CONTRIBUTING.md` (code style, PR process, local‑dev notes).  
2. **MkDocs** (or Docusaurus) site, автоматически публикуемый в GitHub Pages (`/docs`).  
3. **Diagrams** (draw.io → SVG) – дорожная карта, data‑flow, security layers.  

## Acceptance Criteria
- ✅ Документация покрывает **100 %** публичных компонентов (пользовательский и dev‑флоу).  
- ✅ Автоматическая сборка `mkdocs build` проходит без ошибок в CI.  
- ✅ Ссылка в `README.md` указывает на live‑docs (`https://patient‑lab.github.io/docs`).  
- ✅ Новые члены команды могут **setup** проект за < 30 минут (следуя `GETTING_STARTED.md`).  

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Составить `README` шаблон (badges, quick start) | Docs | 2 |
| 2 | Написать `GETTING_STARTED` (Node, Vite, Supabase CLI) | Docs | 3 |
| 3 | Подготовить `ARCHITECTURE.md` с Mermaid‑диаграммами (flow, data, CI) | Architect | 4 |
| 4 | Описать API (`/api/*`), webhook payloads, Supabase RPC | Backend | 5 |
| 5 | Создать `CONTRIBUTING` (code‑style, PR steps, testing) | Lead Dev | 3 |
| 6 | User‑Guide: «как пройти тест», «как экспортировать PDF», «как оплатить» | PM/UX | 4 |
| 7 | FAQ + Troubleshooting таблица (push‑fail, payment‑decline) | Support | 3 |
| 8 | Настроить MkDocs + `mkdocs.yml` (theme, navigation) | DevOps | 2 |
| 9 | Добавить генерацию диаграмм (draw.io → SVG) в репозиторий | Designer | 2 |
|10| Интегрировать `mkdocs build` в CI (GitHub Actions) | DevOps | 2 |
| **Итого** | | | **30 ч** |

## Dependencies
- **Epic 01** (структура проекта).  
- **Epic 10** (CI) – добавить step `mkdocs build`.  

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Документация устареет после релизов | Средний | Автоматический reminder в GitHub Projects (quarterly review). |
| Недостаток времени у dev‑команды | Средний | Выделить отдельный “Doc‑sprint” (2 дня) после каждого major release. |

## Best‑Practice Tips
- **Use Markdown lint** (`markdownlint-cli`) в CI.  
- **Link to source code** (`[src](/src/components/Relaxation.tsx)`) в API‑docs.  
- Делать **inline‑code snippets** (`npm run dev`, `supabase db reset`).  
- Для визуализации используйте **Mermaid** в MkDocs (auto‑render).  

---  


