# Exercise 3 — короткий план

Цель: добавить React в готовый Vite + TypeScript проект и перенести на него только оболочку
приложения и Dashboard. Evidence, People, Timeline и Workspace пока не переписываем.

Git-коммиты и push выполняет только владелец репозитория. После каждой законченной Demo — отдельный
коммит. Все заметки держим короткими, до 100 строк на файл.

## Стратегия миграции

- `/` — рабочая vanilla-версия из Exercise 2;
- `/?react=1` — новая React-версия;
- обе версии используют те же типы и JSON из `public/data/`;
- после Exercise 3 React-версия содержит shell, пять маршрутов-заглушек и настоящий Dashboard.

## План

1. **История веба**
   Создать `demo1.md`: короткая шкала MPA → AJAX → SPA → современный React и место текущего
   приложения на ней. Ответить на оба вопроса задания.
   Коммит: `docs: explain web application evolution`.

2. **SSR и CSR**
   Создать `demo2.md`: таблица SSR/CSR, разбор одного реального сайта через View Source и Network,
   затем путь `index.html → main.ts → JSON → Dashboard` и цена CSR.
   Коммит: `docs: compare SSR and CSR`.

3. **Virtual DOM**
   Создать `demo3.md`: объяснить Virtual DOM и показать конкретный старый фрагмент `app.js`, где
   маленькое изменение пересоздавало большой `innerHTML`. Указать пользу и цену diffing.
   Коммит: `docs: explain virtual DOM tradeoffs`.

4. **SPA, состояние и routing**
   Создать `demo4.md`: схема текущей hash-навигации и таблица состояния — память или `localStorage`.
   Проверить Back button, fallback и перечислить задачи полноценного router.
   Коммит: `docs: document SPA state and routing`.

5. **Первый React-компонент**
   Создать `demo5.md` с маленьким JSX-компонентом и сравнением с `renderEvidenceCardHTML()`.
   Объяснить JSX, создание DOM и почему render-функция должна быть чистой.
   Коммит: `docs: introduce React components and JSX`.

6. **React + TypeScript**
   Установить React, React DOM, Vite React plugin и типы. Добавить `.tsx` entry point и минимальный
   `<App />`. Переключать версии через `?react=1`, не удаляя vanilla-приложение. Описать это в
   `demo6.md`.
   Коммит: `feat: add React TypeScript entry point`.

7. **Компонентная структура**
   Создать диаграмму всего будущего приложения: App, Layout, пять pages и общие UI-компоненты.
   Для минимум пяти компонентов указать props и источник данных. Описать решения в `demo7.md`.
   Коммит: `docs: design React component hierarchy`.

8. **Architecture Decision Record**
   Создать `demo8.md`: почему React SPA подходит именно этому приложению, его минусы и альтернативы.
   Отдельно рассмотреть слабые устройства и плохое соединение.
   Коммит: `docs: record React SPA decision`.

9. **React shell**
   Перенести header, branding и navigation. Сделать hash-routing между пятью React-страницами;
   Dashboard пока может быть заглушкой, остальные четыре остаются заглушками. Добавить fallback для
   неизвестного route и описать отличие от старого routing в `demo9.md`.
   Коммит: `feat: migrate application shell to React`.

10. **React Dashboard**
    Загрузить реальные case, evidence и timeline через существующий data layer. Разделить Dashboard
    на summary, stats, progress и recent lists. Проверить уход со страницы и возврат без потери данных,
    затем ответить на вопросы в `demo10.md`.
    Коммит: `feat: migrate Dashboard to React`.

## Проверка перед каждым кодовым коммитом

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. Вручную проверить `/` и `/?react=1`, навигацию и Console.

Чекбокс Demo отмечаем только после выполнения всех её tasks и questions.
