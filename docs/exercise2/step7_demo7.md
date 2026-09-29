# Demo 7 — Full TypeScript Migration

Все 8 оставшихся модулей перенесены с `.js` на `.ts`: `dashboard`, `people`, `timeline`,
`workspace`, `evidence`, `data`, `navigation` и `main`. В `src` больше нет JavaScript-файлов.

## Что пришлось решить

- DOM-элементы и `EventTarget` могут быть `null` или иметь неизвестный тип. Добавлены проверки и
  сужение типов — это защищает от реальных runtime-ошибок.
- Вычитание объектов `Date` заменено на явный `getTime()`. JavaScript это позволял, TypeScript
  потребовал сделать намерение понятным.
- Поле закладки создавалось динамически. В `Evidence` оно теперь описано как
  `bookmarked?: boolean`, поэтому модель соответствует реальному состоянию приложения.
- Ответы `fetch().json()` принимаются как `unknown` и проходят runtime guards. Статические типы сами
  по себе не могут проверить содержимое внешних JSON-файлов.

`any` не используется. Импорты между TypeScript-модулями оставлены с расширением `.js`, например
`./state.js`: это корректный путь будущего JavaScript-модуля для Vite/браузера.

ESLint теперь проверяет `.ts`, а `npm run build` сначала запускает typecheck. Используется
TypeScript 6: TypeScript 7 пока не входит в поддерживаемый диапазон текущего `typescript-eslint`.

## Проверка

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

После запуска проверяем все пять views, сортировку и детали evidence, timeline modal, slider и
сохранение hypothesis в `localStorage`. Проверка production preview прошла без ошибок Console:
5 stat cards, 18 evidence cards, 6 people, 6 locations и 15 timeline events.

Во время проверки нашёл старую проблему production build: аватары из JSON не попадали в `dist`.
Они перенесены в `public/assets/people`, поэтому Vite теперь копирует все 6 PNG без изменения путей
в JSON.
