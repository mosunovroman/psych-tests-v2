# EPIC 02 – Экспорт результатов в PDF и визуализация прогресса

## Цель (SMART)
За 3 недели реализовать:
- **PDF‑отчёт** со всеми пройденными тестами, баллами и рекомендациями.  
- **График прогресса** (линейный/бар) для каждой шкалы, сохраняемый в `localStorage` и экспортируемый в PDF.  

## Deliverables
1. `src/components/PdfExportButton.tsx` – открывает диалог «Скачать PDF».
2. `src/components/ProgressChart.tsx` – Chart.js (или Recharts) график, поддерживает multiple datasets.
3. Сервис `src/services/pdfService.ts` на базе **html2pdf.js** (client‑side) + **jsPDF** (fallback).
4. Добавить кнопку `Export` в `TestResultPage`.
5. Тесты (Jest) на генерацию PDF (проверка наличия ключевых строк в `ArrayBuffer`).

## Acceptance Criteria
- ✅ При нажатии «Export» генерируется PDF, скачивается без ошибок (Chrome/Firefox).
- ✅ PDF содержит: название теста, дату, список вопросов/ответов, итоговый балл, рекомендацию (из AI‑бота) – в виде текста.
- ✅ На странице `Progress` отображается интерактивный график с возможностью выбора диапазона (неделя/мес/год).
- ✅ График корректно отображает данные даже если пользователь не прошёл ни одного теста (показывает «No data»).
- ✅ Unit‑тесты покрывают 90 % кода PDF‑сервиса.

## Tasks
| № | Описание | Owner | Est. (ч) |
|---|----------|-------|----------|
| 1 | Подключить `html2pdf.js` + `jsPDF` в проект (Vite plugin) | Front‑end | 2 |
| 2 | Создать `PdfExportButton` с UI‑модалем (Tailwind modal) | Front‑end | 4 |
| 3 | Реализовать `pdfService` – собрать HTML‑шаблон, стилизовать | Front‑end | 6 |
| 4 | Интегрировать в `TestResultPage` (передача данных) | Front‑end | 4 |
| 5 | Добавить `ProgressChart` – установить `chart.js` + `react-chartjs-2` | Front‑end | 5 |
| 6 | Хранить историю тестов в `localStorage` (array of objects) | Front‑end | 3 |
| 7 | Добавить UI‑страницу `Progress` с графиком + фильтром | Front‑end | 5 |
| 8 | Писать unit‑тесты для сервиса PDF и компонента Chart | QA/Dev | 8 |
| 9 | Добавить E2E‑тест (Cypress) «Export PDF» (проверка скачивания) | QA | 6 |
| **Итого** | | | **43 ч** |

## Dependencies
- Завершённый **Epic 01** (компонентная база).  
- `chart.js` и `html2pdf.js` под лицензией MIT – совместимы.

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF‑generation может зависеть от большого HTML (размер > 5 MB) | Средний | Ограничить шаблон до самых нужных полей; использовать `canvas` для графика. |
| Кросс‑браузерные баги в `html2pdf` | Средний | Тестировать в Chrome, Firefox, Safari; применять `jsPDF` как fallback. |

## Best‑Practice Tips
- **Separate template**: храните HTML‑шаблон в `public/pdf-template.html` и подставляйте данные через `mustache`‑подобную подстановку.  
- **Lazy‑load** Chart.js только на странице прогресса (dynamic import).  
- Сохраняйте **raw data** (`testResults`) в `localStorage` под ключом `patientLab.results` – JSON.stringify/parse с версией схемы, чтобы future‑migrations были проще.  

---  


