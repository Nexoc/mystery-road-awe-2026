# Demo 6 — callbacks вниз по дереву

> Здесь описана prop-chain на этапе Demo 6. Она сохранена в commit `e424934`; в Demo 8 bookmark
> chain заменяется Context, а note callback остаётся явным.

## Владельцы состояния

Bookmark state и Notes state находятся в `App`.

- `bookmarkIds` — единственный источник истины для bookmark-кнопки, Dashboard count и Workspace
  bookmarks.
- `notes` — единственный источник сохранённых заметок для Evidence и Workspace.
- `EvidenceDetail` дополнительно хранит локальный `draftNote`. Это ещё не сохранённая заметка, а
  редактируемый текст до submit.

## Callback chain: bookmarks

```text
App.handleToggleBookmark
→ AppRoutes.onToggleBookmark
→ EvidencePage.onToggleBookmark
→ EvidenceCard.onToggleBookmark
→ onToggleBookmark(evidence.id)
```

Callback проходит три границы props: `AppRoutes`, `EvidencePage`, `EvidenceCard`.

`EvidenceCard` не получает `setBookmarkIds` и не знает про `localStorage`. Он сообщает только ID
Evidence, для которого пользователь запросил toggle.

## Callback chain: notes

```text
App.handleSaveNote
→ AppRoutes.onSaveNote
→ EvidencePage.onSaveNote
→ EvidenceDetail.onSaveNote
→ onSaveNote(evidence.id, draftNote)
```

Этот callback также проходит три границы props. `EvidenceDetail` передаёт владельцу только Evidence
ID и текст. Он не изменяет объект `notes`, не получает setter и не знает, где state сохраняется.

После сохранения value идёт в другую ветку дерева:

```text
App.notes
→ AppRoutes.notes
→ WorkspacePage.notes
→ NotesList
```

`NotesList` вычисляет отображаемые entries из Evidence и Notes во время render. Пользовательский текст
выводится как `{entry.text}`, поэтому не используется `innerHTML`.

## Почему child не изменяет parent state напрямую

Props доступны только для чтения. Если child получил бы объект и изменил его напрямую, React мог бы
не увидеть новую ссылку, а владелец потерял бы контроль над правилами обновления и persistence.

Callback задаёт разрешённое действие. Владелец state:

1. получает минимальные данные;
2. создаёт новый объект через spread;
3. вызывает setter;
4. сохраняет готовое значение в `localStorage`;
5. обрабатывает ошибку записи.

## Как update вызывает новый render

`handleSaveNote` создаёт `nextNotes` и передаёт новую ссылку в `setNotes`. React повторно рендерит
`App`, затем `AppRoutes` и активную route-ветку с новыми props.

При переходе в Workspace `App` не размонтируется, поэтому `WorkspacePage` сразу получает актуальные
notes без reload. После полного reload lazy initializer `readNotes()` восстанавливает тот же state из
`localStorage`; `useEffect` для этого не нужен.

## Является ли это prop drilling

Технически да: `AppRoutes` и `EvidencePage` в основном передают callbacks дальше. Сейчас глубина
составляет только три уровня, имена props явные, а две цепочки легко проследить. Для приложения этого
размера это управляемая передача, а не критическая архитектурная проблема.

Context специально не используется, чтобы сохранить наглядную prop-версию для сравнения. В Demo 8
bookmark props будут заменены Context, после чего можно будет честно оценить, стало ли решение проще
или только более глобальным.

## Persistence

`readNotes()` безопасно разбирает `unknown`, проверяет shape и возвращает `{}` при повреждённых
данных. `writeNotes()` возвращает результат записи. Если storage недоступен, React-state остаётся
актуальным для текущей сессии, а пользователь видит предупреждение.

## Как показать Demo

1. Открыть Evidence Detail и изменить локальный draft note.
2. Нажать Save и показать переход callback до `App.handleSaveNote`.
3. Перейти в Workspace и показать ID, title и note text без reload.
4. Перезагрузить страницу и показать восстановление note.
5. Выполнить bookmark toggle и проследить вторую callback chain.
6. Показать, что children получают callbacks, но не React setters.
7. Объяснить, почему три уровня props пока не требуют Context.
