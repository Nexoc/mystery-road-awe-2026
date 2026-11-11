# Demo 1 — React event handlers вместо vanilla listeners

## Что изменено

- Evidence Catalogue и Workspace построены React-компонентами.
- Bookmark использует `onClick`, открытие карточки — `onClick` и `onKeyDown`.
- Search и остальные controls используют `onChange`.
- Note и Hypothesis form используют `onSubmit`.
- В React-ветке нет inline `onclick` и ручной регистрации `addEventListener` для этих действий.

## React и vanilla event handlers

В React обработчик передаётся как функция через JSX:

```tsx
<button type="button" onClick={handleBookmarkClick}>
  Bookmark
</button>
```

React вызывает эту функцию и передаёт React event object. Например,
`MouseEvent<HTMLButtonElement>` является типизированным React `SyntheticEvent`, который даёт
согласованный API и доступ к исходному событию через `nativeEvent`.

В vanilla-коде `addEventListener("click", handler)` получает нативный browser `MouseEvent`. Inline
`onclick="..."` тоже выполняется браузером и зависит от функции в глобальной области. Это похожие,
но не идентичные объекты и разные способы владения событием.

## Нужна ли event delegation

Для списка Evidence она больше не нужна. Каждый `EvidenceCard` декларативно получает собственный
handler, а React сам управляет регистрацией и обновлением событий во время reconciliation. Не нужно
после каждого ручного render снова искать container и добавлять listener.

React внутри использует делегирование как часть реализации, но приложению не нужно вручную проверять
`event.target`. Ручная delegation всё ещё возможна для специальной логики, однако она не нужна как
обходной путь для повторно созданного HTML.

## Как показать Demo

1. Нажать bookmark на карточке.
2. Открыть карточку мышью и клавишей Enter.
3. Сохранить note и hypothesis form.
4. Показать JSX handlers и отсутствие ручных listeners в `src/react/features`.
