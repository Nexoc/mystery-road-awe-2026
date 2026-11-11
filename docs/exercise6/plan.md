# Exercise 6 — план первых пяти заданий

Этот документ описывает только **Demo 1–5** из `EXERCISE_6.md`. Сейчас создаётся план; код,
зависимости, backend и конфигурация проекта пока не меняются. Чекбоксы Self-Check нужно отмечать
только после ручной проверки и живой демонстрации.

## 1. Главная цель

В Exercise 5 данные загружаются до первого React render. В Exercise 6 React должен сам управлять
жизненным циклом сетевого запроса:

```text
первый render
→ effect запускает запрос
→ Node backend читает JSON
→ ответ проходит проверку
→ React state получает данные
→ новый render показывает приложение
```

К концу Demo 5 должны быть готовы:

- понятное различие между чистым render и side effect;
- реальные примеры `useEffect` и dependency arrays;
- effect с правильным cleanup;
- локальный read-only Node backend;
- загрузка всех пяти ресурсов с backend внутри React effect.

## 2. Текущее состояние проекта

- Рабочая ветка: `exercise-6`.
- React работает в режиме `/?react=1` и использует `StrictMode`.
- `src/react/main.tsx` сначала вызывает `await loadInvestigationData()`, а только затем монтирует
  React.
- `src/react/data.ts` загружает файлы из `public/data/*.json` и уже проверяет `response.ok` и форму
  JSON.
- `App` получает полностью готовый `InvestigationData` через prop.
- Backend и backend-зависимости отсутствуют.
- Bookmarks, Notes и Hypothesis draft хранятся в `localStorage`. Они не переносятся на backend.
- Vanilla-режим должен продолжать читать статические JSON. Меняется только React-ветка.

## 3. Архитектура после Demo 5

```text
Browser
  │ GET /api/case, /api/evidence, /api/people,
  │     /api/locations, /api/timeline
  ▼
Vite dev proxy
  ▼
Node/Express :3001
  ▼
public/data/*.json (только чтение)

React:
main.tsx
└── HashRouter
    └── InvestigationApp
        ├── useEffect запускает loadInvestigationData()
        ├── data/error находятся в state
        └── App data={data}
            └── существующие routes и views
```

`App` сохраняет текущую логику bookmarks, notes, Context и routes. Новый loader-компонент монтирует
`App` только после получения полного набора данных.

## 4. Границы первых пяти Demo

Пока не нужно преждевременно выполнять Demo 6–9:

- полноценный дизайн loading/error/empty states оставить Demo 6;
- `AbortController` и защиту от request races оставить Demo 7;
- reusable custom hook оставить Demo 8;
- окончательное разделение API layer / hook / UI оставить Demo 9.

В Demo 5 нужен только минимальный loading/error output, чтобы запрос не приводил к пустому экрану или
Unhandled Promise Rejection.

---

## Demo 1 — Render logic и side effects

### Простое объяснение

Render должен быть чистым: компонент читает props/state, вычисляет derived values и возвращает JSX.
Он не должен изменять Console, DOM, timers, storage, network или другие внешние системы.

Effect нужен, когда уже отрисованный React-компонент должен синхронизироваться с внешней системой.

### Реальный пример в текущем проекте

В `src/react/features/workspace/components/NotesList.tsx` вызов `debugLog()` находится прямо в теле
компонента. `debugLog()` записывает данные в Console, поэтому это side effect во время render.

В `StrictMode` React может вызвать render повторно для проверки чистоты. Из-за этого render-log может
появиться дважды. При concurrent rendering React также может начать render и отказаться от него, но
side effect уже успеет выполниться.

### План изменений

1. Открыть Workspace и зафиксировать текущий повторяющийся log как before-example.
2. Объяснить, почему Console является внешней системой.
3. Удалить log из render или перенести его в effect, если он всё ещё нужен для презентации.
4. Выполнить поиск всех `debugLog()` в React-компонентах.
5. Разделить их на:
   - допустимые logs внутри event handlers;
   - допустимые logs внутри async loader;
   - render-time logs, которые нужно удалить или перенести.
6. Не переносить `getVisibleEvidence()` в effect: это чистое derived вычисление.
7. Создать `docs/exercise6/demo1.md` с before/after и ответами.

Команда аудита:

```bash
rg -n "debugLog\(" src/react
```

### Ответы на вопросы

React может повторять render из-за `StrictMode`, parent update и прерванного concurrent render.
Side effect в render может выполниться дважды или выполниться для UI, который вообще не был
committed.

Filtered Evidence не является side effect: функция получает входные данные, создаёт новое значение
и не изменяет внешнюю систему или исходный массив.

### Готово, если

- выбранный side effect отсутствует в render;
- derived calculations остались в render;
- есть понятный before/after пример;
- можно своими словами объяснить правило «render вычисляет, effect синхронизирует».

---

## Demo 2 — `useEffect` и dependency arrays

### Простое объяснение

`useEffect` запускается после committed render. Dependency array определяет, когда React должен
повторить синхронизацию:

- без массива — после каждого commit;
- `[]` — после mount; в development `StrictMode` возможна проверка setup → cleanup → setup;
- `[value]` — после mount и при изменении `value`.

### Учебный компонент

Создать отдельный presentation-компонент:

```text
src/react/features/effects/EffectLifecycleDemo.tsx
```

Он содержит counter и три маленьких effects с `debugLog("6.2", ...)`. Для живой демонстрации
добавить route `/effects-demo`. Его можно не добавлять в основную навигацию: открыть напрямую через
`/?react=1#/effects-demo`.

Нужно показать:

1. первый mount;
2. изменение counter;
3. обычный parent re-render;
4. поведение трёх вариантов dependency array;
5. дополнительный development-cycle `StrictMode`.

### Реальный постоянный effect

В `src/react/app/App.tsx` добавить `DocumentTitleSync`:

1. получить текущий `pathname` через `useLocation()`;
2. во время render чисто вычислить название страницы;
3. в `useEffect` синхронизировать `document.title`;
4. указать вычисленный title или `pathname` в dependencies;
5. компонент возвращает `null` и не управляет DOM разметкой приложения.

Это оправданный effect: `document.title` принадлежит browser API, а не React JSX tree.

### Что сравнивает React

React сравнивает каждую dependency с предыдущим значением через `Object.is`. Если effect использует
reactive value, но оно отсутствует в массиве, closure может сохранить старое значение и effect не
запустится после нужного изменения.

`useEffect(fn, [])` не равен вызову `fn()` в теле компонента:

- effect выполняется после commit;
- функция в render выполняется до commit и при каждом render;
- effect может вернуть cleanup;
- render может быть повторён или отменён.

### Файлы

- новый `src/react/features/effects/EffectLifecycleDemo.tsx`;
- `src/react/app/routes.tsx` — presentation route;
- `src/react/app/App.tsx` — реальная синхронизация title;
- `src/shared/debug.ts` — временно включить markers `6.2`/`6.3` для презентации;
- новый `docs/exercise6/demo2.md`.

### Готово, если

- показаны все три варианта dependency array;
- title меняется при навигации без click-specific кода;
- все используемые reactive values указаны в dependencies;
- можно объяснить `Object.is`, stale closure и момент запуска effect.

---

## Demo 3 — Cleanup timers и subscriptions

### Выбранный реальный сценарий

Добавить закрытие `EvidenceDetail` клавишей Escape.

В `src/react/features/evidence/components/EvidenceDetail.tsx` effect должен:

1. создать `handleKeyDown`;
2. зарегистрировать `window.addEventListener("keydown", handleKeyDown)`;
3. при `Escape` вызвать `onClose()`;
4. вернуть cleanup с `window.removeEventListener`;
5. использовать тот же reference handler при add/remove;
6. указать `onClose` в dependencies;
7. логировать setup и cleanup через `debugLog("6.3", ...)`.

В `EvidencePage.tsx` стабилизировать `handleCloseEvidence` через `useCallback`, чтобы subscription не
пересоздавалась из-за нерелевантных renders.

### Как показать проблему без cleanup

Сохранить промежуточный before-commit без cleanup, затем исправить его следующим commit:

1. несколько раз открыть и закрыть разные Evidence;
2. каждый mount добавит ещё один `window` listener;
3. нажать Escape;
4. старые handlers вызовут повторные route updates и могут использовать старые search params;
5. после добавления cleanup остаётся только текущая subscription.

### Когда вызывается cleanup

- перед повторным запуском effect после изменения dependency;
- при unmount компонента;
- дополнительно в development `StrictMode` для проверки симметрии setup/cleanup.

Cleanup вызывает React. Внутри cleanup приложение удаляет listener или очищает timer.

### Файлы

- `src/react/features/evidence/components/EvidenceDetail.tsx`;
- `src/react/features/evidence/EvidencePage.tsx`;
- `docs/exercise6/demo3.md`.

### Готово, если

- listener создаётся только в effect;
- cleanup удаляет именно этот listener;
- Close, route change и unmount вызывают cleanup;
- после нескольких открытий один Escape вызывает одно закрытие;
- setup/cleanup видны в Console и понятны студенту.

---

## Demo 4 — Read-only Node backend

### Технологическое решение

Использовать небольшой Express server в обычном ESM JavaScript. Проект уже имеет
`"type": "module"`, а JavaScript backend не требует менять frontend `tsconfig`.

Новая структура:

```text
server/
├── index.js
└── dataStore.js
```

`dataStore.js` читает пять фиксированных файлов из `public/data` через `node:fs/promises`. Имя файла
не должно приходить от пользователя: использовать явную таблицу resource → filepath, чтобы не
создать path traversal.

### Endpoints

```text
GET /api/case       → object
GET /api/evidence   → array
GET /api/people     → array
GET /api/locations  → array
GET /api/timeline   → array
GET /api/health     → optional health response
```

Backend только читает JSON. Write endpoints, база данных и перенос `localStorage`-данных запрещены
границами Exercise 6.

### Delay и simulated error

Каждый data endpoint поддерживает:

```text
?delay=1500
?fail=1
?delay=1500&fail=1
```

Правила:

- `delay` — целое число от `0` до `10000` ms;
- неправильный delay возвращает `400` и JSON error;
- `fail=1` возвращает предсказуемый `500`;
- delay применяется и к success, и к simulated failure;
- ответы получают `Cache-Control: no-store`;
- неизвестный `/api/...` возвращает JSON `404` без stack trace.

Искусственные условия нужны, потому что локальные JSON обычно отвечают почти мгновенно. Без них
нельзя стабильно показать loading, error, cleanup, cancellation и request race.

### CORS и Vite proxy

Frontend и backend работают на разных портах, то есть это разные origins. Чтобы не добавлять CORS
middleware, в `vite.config.ts` настроить dev proxy:

```text
/api → http://127.0.0.1:3001
```

Browser обращается к same-origin `/api/...`, а Vite пересылает запрос server-to-server. Поэтому CORS
в browser не возникает. При прямом обращении frontend к порту `3001` понадобился бы
`Access-Control-Allow-Origin`.

### Package scripts и конфигурация

Планируемые команды установки:

```bash
npm install express
```

Планируемые scripts:

```text
npm run dev:server   → node --watch server/index.js
npm run start:server → node server/index.js
npm run dev          → vite
```

Backend и Vite запускать в двух терминалах. Дополнительный `concurrently` не нужен.

Также изменить:

- `vite.config.ts` — proxy `/api`;
- `eslint.config.js` — Node globals для `server/**/*.js`;
- `package.json` format patterns — добавить `server/**/*.js`;
- `README.md` — dev-only backend, запуск, endpoints, delay/fail;
- deploy workflow не менять: GitHub Pages не запускает Node server.

### Ручная проверка

```bash
curl http://localhost:3001/api/evidence
curl "http://localhost:3001/api/evidence?delay=2000"
curl "http://localhost:3001/api/evidence?fail=1"
```

В Git Bash команды работают как показано. В PowerShell можно использовать `Invoke-RestMethod` и
`Invoke-WebRequest`.

### Ответы на вопросы

Delay/error делают асинхронные состояния повторяемыми. Статические файлы не дают надёжно показать
долгий pending request, server error или race.

CORS ограничивает browser requests между origins. В выбранной архитектуре CORS не настраивается,
потому что browser видит Vite same-origin URL, а proxy общается с backend вне browser.

### Готово, если

- пять endpoints возвращают исходные shapes;
- delay измеримо задерживает ответ;
- `fail=1` стабильно даёт `500`;
- неверный delay даёт `400`;
- `/api` работает через Vite proxy;
- backend ничего не записывает;
- README явно говорит «local development only»;
- deploy pipeline не запускает backend.

---

## Demo 5 — React загружает данные с backend

### Почему текущую загрузку нужно изменить

Сейчас `src/react/main.tsx` ждёт `loadInvestigationData()` до `createRoot().render()`. React не видит
pending или error: компонент ещё не существует.

Нужно смонтировать React сразу, а запрос запустить после первого commit через `useEffect`.

### Новый loader-компонент

Создать:

```text
src/react/app/InvestigationApp.tsx
```

Структура:

```text
InvestigationApp
├── data: InvestigationData | null
├── loadError: string | null
├── isLoading = data === null && loadError === null (derived)
├── useEffect(() => loadInvestigationData(), [])
└── после success: <App data={data} />
```

`App` не нужно превращать в компонент с условными hooks. Он по-прежнему монтируется только с готовыми
данными и безопасно инициализирует bookmark state из `data.evidence`.

Effect callback не объявлять `async`: React ожидает от него `undefined` или cleanup, а не Promise.
Внутри effect вызвать Promise chain либо вложенную async-функцию.

### Изменения по файлам

#### `src/react/main.tsx`

- удалить import и top-level `await loadInvestigationData()`;
- вызвать `createRoot().render()` сразу;
- рендерить `<InvestigationApp />` внутри Router.

#### `src/react/app/InvestigationApp.tsx`

- добавить `useState` для data/error;
- добавить `useEffect(..., [])`;
- показать минимальный Loading/Error text;
- после success передать готовые данные в существующий `App`.

#### `src/react/data.ts`

- сохранить runtime validators;
- заменить static URLs на `/api/case`, `/api/evidence`, `/api/people`, `/api/locations`,
  `/api/timeline`;
- сохранить `response.ok`, JSON validation и `Promise.all`;
- после Evidence прочитать bookmark IDs из `localStorage` и удалить неизвестные IDs;
- Notes и Hypothesis не переносить на backend.

#### Не менять

- `src/app/data.ts` — это legacy vanilla mode;
- `InvestigationData` shape;
- bookmark/note/hypothesis persistence;
- GitHub Pages backend deployment.

### Переход в два шага

1. Сначала перевести Evidence на `/api/evidence`, оставив остальные четыре static URLs. Показать в
   Network разницу источников.
2. Затем перевести case, people, locations и timeline. После этого React mode не должен запрашивать
   `data/*.json`.

### Порядок событий

```text
InvestigationApp mount
→ первый render: data === null
→ React commit
→ effect вызывает loadInvestigationData()
→ Promise.all запускает пять fetch
→ backend отвечает
→ response и JSON проходят проверки
→ setData(data)
→ React планирует новый render
→ InvestigationApp рендерит App
→ routes получают data
```

В development `StrictMode` может показать два набора GET requests. Backend read-only, поэтому это
безопасно. Cancellation и защита от stale responses намеренно появятся только в Demo 7.

### Новое состояние по сравнению с Exercise 5

Раньше React получал только готовый data object. Теперь компоненту нужно различать:

- запрос ещё выполняется;
- данные получены;
- запрос завершился ошибкой.

В Demo 5 достаточно простого текста. Отдельный empty state и полноценный UX относятся к Demo 6.

### Ручная проверка

1. В первом терминале запустить `npm run dev:server`.
2. Во втором — `npm run dev`.
3. Открыть `/?react=1#/evidence`.
4. В Network увидеть пять `/api/...` requests.
5. Проверить Dashboard, Evidence, People & Locations, Timeline и Workspace.
6. Перезагрузить страницу и проверить bookmarks/notes/hypothesis.
7. Остановить backend и перезагрузить — должен появиться минимальный error output.

### Готово, если

- первый React render больше не блокируется top-level `await`;
- запрос запускается внутри `useEffect`;
- все пять ресурсов приходят с backend;
- все пять views работают как раньше;
- localStorage-функции не сломаны;
- ошибка backend обработана, а не становится unhandled rejection;
- пока нет `AbortController`, reusable fetch hook и сложного empty-state UI.

---

## 5. Предлагаемая последовательность commits

```text
docs: plan first five exercise 6 demos
refactor: keep React render logic pure
feat: demonstrate effect dependency modes
feat: clean up evidence detail subscription
feat: add read-only development API
feat: load investigation data from API effect
```

Для демонстрации missing cleanup можно сделать короткий промежуточный commit без cleanup и сразу
следующий исправляющий commit. Финальное состояние ветки обязательно должно содержать cleanup.

## 6. Проверки после каждого Demo

Frontend:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

После Demo 4 дополнительно проверить каждый endpoint, delay, failure и proxy. После Demo 5 вручную
пройти все пять React views и проверить Network/Console.

## 7. Что документировать по ходу работы

После каждой реализации создать отдельный файл:

```text
docs/exercise6/demo1.md
docs/exercise6/demo2.md
docs/exercise6/demo3.md
docs/exercise6/demo4.md
docs/exercise6/demo5.md
```

В каждом файле кратко записать:

1. что изменено;
2. где находится главный код;
3. ответы на вопросы задания;
4. как показать Demo вручную;
5. известные ограничения текущего этапа.

## 8. Финальный сценарий презентации Demo 1–5

1. Показать плохой render-log и объяснить его дублирование.
2. Показать три dependency-array режима в Effects Demo.
3. Перейти между routes и показать изменение `document.title`.
4. Открыть Evidence Detail, закрыть Escape и показать setup/cleanup.
5. Запустить backend и показать пять endpoints.
6. Включить `delay` и `fail=1` напрямую на endpoint.
7. Открыть React Network и показать пять `/api` requests после mount.
8. Пройти все пять views и показать сохранённые localStorage-данные.

