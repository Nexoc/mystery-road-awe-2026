# Demo 6.4 — Read-only Node backend

## Что изменено

- Добавлен локальный Express server на `127.0.0.1:3001`.
- Server при запуске читает пять фиксированных JSON-файлов из `public/data`.
- Созданы endpoints для case, evidence, people, locations и timeline.
- Добавлены управляемые `delay` и `fail=1` для следующих Demo.
- Vite proxy перенаправляет browser requests `/api/...` на backend.
- Backend запускается только локально и не добавлен в GitHub Pages workflow.

## Endpoints

```text
GET /api/case
GET /api/evidence
GET /api/people
GET /api/locations
GET /api/timeline
GET /api/health
```

Data endpoints возвращают те же shapes, что соответствующие JSON-файлы. Write endpoints и база
данных отсутствуют. Bookmarks, Notes и Hypothesis остаются в `localStorage`.

## Delay и error simulation

```text
?delay=1500
?fail=1
?delay=1500&fail=1
```

`delay` принимает целое значение `0–10000` ms. Неправильное значение возвращает `400`. `fail=1`
после указанной задержки возвращает предсказуемый `500`.

Эти controls нужны, потому что статические JSON обычно отвечают слишком быстро и предсказуемо. Без
них сложно повторяемо показать loading state, error UI, request race и cancellation.

## CORS

Vite и backend используют разные порты и технически являются разными origins. Browser, однако,
вызывает same-origin URL `/api/...`; Vite proxy пересылает запрос на `127.0.0.1:3001` server-to-server.
Поэтому CORS middleware не нужен.

При прямом browser fetch на порт `3001` потребовался бы разрешающий `Access-Control-Allow-Origin`.

## Безопасность и границы

- JSON paths заданы фиксированной таблицей, а не пользовательским filename.
- Server не записывает файлы.
- HTTP errors не возвращают stack trace.
- Ответы используют `Cache-Control: no-store` для повторяемых Demo.
- Backend не запускается в deploy workflow.

## Запуск

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev
```

## Как показать Demo

```bash
curl http://127.0.0.1:3001/api/evidence
curl "http://127.0.0.1:3001/api/evidence?delay=2000"
curl "http://127.0.0.1:3001/api/evidence?fail=1"
curl "http://127.0.0.1:3001/api/evidence?delay=invalid"
```

Показать status `200`, измеримую задержку, simulated `500`, validation `400` и proxy request через
Vite. GitHub Pages продолжает собирать только статический frontend.

