# Demo 8 — Bookmark Context и его границы

## Что изменено

Создан узкий `BookmarkContext` со следующим API:

- `bookmarkIds`;
- `isBookmarked(evidenceId)`;
- `toggleBookmark(evidenceId)`.

`App` остаётся единственным владельцем bookmark state, persistence и storage error. Controlled
`BookmarkProvider` только доставляет значение компонентам под `AppRoutes`.

После перехода на Context:

- `AppRoutes` больше не получает и не пересылает bookmark props;
- Dashboard читает актуальные IDs через `useBookmarks()`;
- `EvidenceCard` напрямую читает состояние и вызывает toggle;
- `BookmarksList` напрямую читает состояние для derived списка;
- filters, notes, hypothesis и investigation data не помещены в Context.

Provider value мемоизирован, а `useBookmarks()` выдаёт понятную ошибку при использовании вне
Provider.

## Что Context решает

Context решает доставку значения через дерево без промежуточных props. Он не выбирает владельца
state, не делает immutable update, не сохраняет данные и не валидирует storage автоматически. Всё
это остаётся ответственностью `App` и persistence helpers.

Значение также не является настоящей глобальной переменной: оно доступно только потомкам ближайшего
`BookmarkProvider`.

## Был ли prop drilling реальной проблемой

В Demo 6 callback проходил три prop-boundaries:

```text
App → AppRoutes → EvidencePage → EvidenceCard
```

Для проекта такого размера это ещё управляемая глубина. Context выбран потому, что bookmarks нужны
нескольким sibling routes, и потому, что Demo 8 требует сравнить оба подхода. Для одного значения и
одной дополнительной границы обычные props могли бы остаться проще и нагляднее.

Практический порог для Context — несколько далёких consumers и промежуточные компоненты, которые
стабильно пересылают props, не используя их сами.

## Может ли Context стать unnecessary global state

Да. Если сложить bookmarks, filters, notes, form draft и все загруженные данные в один общий
`GlobalAppContext`, зависимости станут скрытыми, а изменение большого value затронет много
consumers. Поэтому Context здесь узкий, а локальные данные остаются рядом со своими компонентами.

## Как показать Demo

1. Показать prop-chain в commit `e424934`.
2. Показать `BookmarkProvider` и `useBookmarks` в текущем коде.
3. Переключить bookmark и открыть Dashboard и Workspace.
4. Объяснить, почему state всё ещё принадлежит `App`, а Context отвечает только за delivery.
