# Инструкция по настройке Search Console и индексации

## 1. Google Search Console

### Шаг 1: Добавление сайта
1. Перейти на https://search.google.com/search-console
2. Нажать "Добавить ресурс"
3. Выбрать "Ресурс с префиксом URL"
4. Ввести: `https://mind-pro.online/`

### Шаг 2: Подтверждение владения
Верификация уже добавлена в index.html:
```html
<meta name="google-site-verification" content="J-PVPn7M0-UShJFnL9esAhbemEmDcu5Qp1VVYrm1kiU" />
```
Нажать "Подтвердить".

### Шаг 3: Отправка sitemap
1. В меню слева выбрать "Файлы Sitemap"
2. Ввести: `sitemap.xml`
3. Нажать "Отправить"

### Шаг 4: Запрос индексации главных страниц
1. В верхней строке поиска ввести URL: `https://mind-pro.online/`
2. Нажать "Запросить индексирование"
3. Повторить для ключевых страниц:
   - `https://mind-pro.online/tests`
   - `https://mind-pro.online/tests/phq9`
   - `https://mind-pro.online/tests/gad7`
   - `https://mind-pro.online/tests/mbti`
   - `https://mind-pro.online/tests/iq`

---

## 2. Яндекс.Вебмастер

### Шаг 1: Добавление сайта
1. Перейти на https://webmaster.yandex.ru
2. Нажать "Добавить сайт"
3. Ввести: `https://mind-pro.online/`

### Шаг 2: Подтверждение владения
Верификация уже добавлена в index.html:
```html
<meta name="yandex-verification" content="797bcd351ff9dc95" />
```
Выбрать способ "Мета-тег" → "Проверить".

### Шаг 3: Отправка sitemap
1. Перейти в "Индексирование" → "Файлы Sitemap"
2. Добавить: `https://mind-pro.online/sitemap.xml`

### Шаг 4: Запрос переобхода
1. "Индексирование" → "Переобход страниц"
2. Добавить главную страницу и ключевые тесты

---

## 3. Bing Webmaster Tools (опционально)

1. Перейти на https://www.bing.com/webmasters
2. Импортировать сайт из Google Search Console
3. Sitemap добавится автоматически

---

## 4. Проверка индексации

### Через 1-2 недели проверить:
```
site:mind-pro.online
```
в Google и Яндекс.

### Ожидаемые сроки:
- Яндекс: 3-7 дней
- Google: 1-4 недели (для новых доменов)

---

## 5. Ускорение индексации

### Внешние ссылки (важно!):
Разместить ссылки на сайт на следующих ресурсах:
- [ ] Профиль на b17.ru (психологический портал)
- [ ] Профиль на psychologies.ru
- [ ] Telegram-канал @romanskiff
- [ ] VK-сообщество
- [ ] GitHub (README с ссылкой)
- [ ] Яндекс.Справочник (если есть офлайн-услуги)
- [ ] Google Business Profile

### Социальные сигналы:
- Публиковать ссылки в соцсетях
- Просить друзей/коллег поделиться

---

## 6. Мониторинг

### Яндекс.Метрика (уже настроена):
- ID: 106470906
- https://metrika.yandex.ru/dashboard?id=106470906

### Google Analytics (добавить):
1. Создать аккаунт на https://analytics.google.com
2. Создать ресурс GA4
3. Добавить код в index.html (см. ниже)

---

## Чек-лист

- [x] Мета-теги верификации добавлены
- [x] sitemap.xml создан и актуален
- [x] robots.txt настроен
- [x] Schema.org разметка добавлена
- [x] Яндекс.Метрика подключена
- [ ] **Google Search Console — ДОБАВИТЬ САЙТ**
- [ ] **Яндекс.Вебмастер — ДОБАВИТЬ САЙТ**
- [ ] Запросить индексацию главных страниц
- [ ] Разместить внешние ссылки
- [ ] Google Analytics (опционально)
