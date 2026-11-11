# Demo 10 — финальный DOM-sweep

## Результат

Все пять React views строятся через JSX, state, props, Router и узкий Context:

- Dashboard;
- Evidence Catalogue;
- People & Locations;
- Timeline;
- Workspace.

В `src/react/features`, `src/react/app` и `src/react/shared` отсутствуют:

- `document.*` и `querySelector`;
- `innerHTML` и `dangerouslySetInnerHTML`;
- ручные `classList` updates;
- `addEventListener` и inline `onclick`.

Единственный `document.getElementById` в `src/react/main.tsx` получает React mount point. Это
инфраструктурный bootstrap, а не ручная отрисовка view.

Проверка воспроизводится командой:

```bash
rg -n "document\.|querySelector|innerHTML|classList|addEventListener|onclick|dangerouslySetInnerHTML" src/react
```

Legacy vanilla-код намеренно остаётся вне `src/react` для сравнения с предыдущими упражнениями.
React-режим запускается через `/?react=1`.

## Безопасный вывод Notes

Note отображается обычным JSX expression:

```tsx
<div>{entry.text}</div>
```

React экранирует HTML-like текст. `innerHTML` не используется, поэтому строка вроде
`<img src=x onerror=alert(1)>` отображается как текст и не исполняется.

## Неочевидное архитектурное решение

Bookmark Context — честный trade-off. Он убирает промежуточные bookmark props и удобен для трёх
route-веток, но скрывает зависимость consumers и добавляет Provider. Для приложения такого размера
обычные props тоже были бы разумны. Поэтому Context ограничен bookmarks и не превращён в общий store.

## Структурно предотвращённая ошибка

Устаревший bookmark count больше не хранится отдельно. Dashboard всегда вычисляет его как
`bookmarkIds.length` из того же Context, который используют Evidence и Workspace. Отдельного setter
для count нет, поэтому забыть синхронизировать его невозможно.

Filtered Evidence защищён тем же принципом: готовый список не хранится в state и каждый render
вычисляется из полного массива и reducer state. Сортировка выполняется на копии.

## Финальная ручная проверка

1. Открыть `/?react=1#/evidence`.
2. Проверить search, все filters, sort и `Clear filters`.
3. Открыть Evidence, сохранить HTML-like note и переключить bookmark.
4. Проверить новый count на Dashboard и bookmark/note в Workspace.
5. Заполнить Hypothesis form, сохранить и перезагрузить страницу.
6. Проверить People & Locations, Timeline, Back/Forward и неизвестный route.
7. Убедиться, что Console не содержит ошибок.
