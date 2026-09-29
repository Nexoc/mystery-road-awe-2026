# Exercise 2 — короткий план

Цель: перевести готовое приложение из Exercise 1 на npm, Vite и TypeScript, затем добавить CI и
автоматический deploy. React сюда не входит.

Git-коммиты и push выполняет только владелец репозитория. После каждой готовой Demo делаем отдельный
коммит, чтобы её можно было показать через before/after.

## План

1. **npm и метаданные**
   Создать `package.json`, `package-lock.json` и `.gitignore`. Использовать npm, а Vite установить как
   первую реальную `devDependency`. Не коммитить `node_modules/` и `dist/`.
   Коммит: `chore: initialize npm project`.

2. **Vite dev server**
   Оставить `index.html` точкой входа, добавить `vite.config`, команды `dev` и `preview`. Runtime-файлы
   из `data/` и `assets/` перенести в `public/`, чтобы они попали и в production build. Проверить пять
   views и показать HMR на небольшом CSS-изменении.
   Коммит: `build: integrate Vite dev server`.

3. **Production build**
   Добавить `build`, выполнить build и открыть результат через preview. Проверить, что в `dist/` есть
   JSON, логотип и изображения людей; сравнить исходный и собранный JS. Сам `dist/` не коммитить.
   Коммит: `build: verify production build`.

4. **ESLint и Prettier**
   Добавить конфиги и scripts: `lint`, `lint:fix`, `format`, `format:check`. Показать одну настоящую
   lint-ошибку и одно изменение форматтера. Старые docs и бинарные файлы исключить из форматирования.
   Коммит: `chore: add linting and formatting`.

5. **TypeScript — начало**
   Добавить строгий `tsconfig`, `typecheck` и проверку типов во время dev/build. Без `any` перенести
   2–3 небольших модуля (`state`, `utils`, `storage`) и зафиксировать выбранные strict-настройки.
   Коммит: `refactor: start TypeScript migration`.

6. **Типы данных**
   Создать `src/types/domain.ts` для Case, Evidence, Person, Location и TimelineEvent; типизировать
   state и загрузку JSON. Решить реальную неоднозначность: в E04 `personIds` содержит имя `Nova Byte`
   вместо id `nova-byte`. На границе загрузки нормализовать регистр и ссылки; отдельно записать, что
   TypeScript без runtime-проверки не гарантирует корректность внешнего JSON.
   Коммит: `refactor: type domain data and loaders`.

7. **Полная миграция**
   Перевести остальные `.js` в `.ts`, обновить entry point и получить ноль TypeScript-ошибок. Отдельно
   записать минимум три содержательные ошибки: nullable DOM-элементы, `EventTarget` и вычисления с
   `Date`/динамические ключи. После этого полностью проверить поведение приложения.
   Коммит: `refactor: complete TypeScript migration`.

8. **Development workflow**
   Создать `.github/workflows/quality.yml`: checkout, Node, npm cache, `npm ci`, lint, format-check и
   typecheck. Сначала отправить намеренно падающий коммит, затем исправление и сохранить ссылки на оба
   запуска.
   Коммиты: `ci: add quality workflow`, затем `fix: restore quality checks`.

9. **Deployment workflow**
   Создать Pages workflow на push в `exercise-2` с lint, typecheck, build и публикацией `dist/`.
   Настроить Vite `base` для `/mystery-road-awe-2026/`, проверить настоящий URL, все JSON-запросы и картинки.
   Коммит: `ci: deploy app to GitHub Pages`.

10. **Triggers, permissions и failure demo**
    Намеренно отправить TypeScript-ошибку и показать, что deploy остановился до публикации. Затем
    исправить её. Объяснить `push`, `pull_request`, `workflow_dispatch` и минимальные permissions:
    `contents: read`, `pages: write`, `id-token: write`. Старый успешный deploy должен остаться доступен.
    Коммиты: `test: demonstrate blocked deployment`, затем `fix: restore deployment pipeline`.

## Что сохранять для показа

- короткую заметку по каждой Demo: решение, команда проверки и результат;
- failing и passing GitHub Actions runs;
- три реальные TypeScript-ошибки и принятые решения;
- рабочий GitHub Pages URL;
- чекбоксы в `EXERCISE_2.md` отмечать только после живой проверки.