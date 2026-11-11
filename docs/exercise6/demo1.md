# Demo 6.1 — Render logic и side effects

## Что изменено

- Найден реальный side effect во время render: `NotesList` вызывал `debugLog()`, который записывал
  сообщение в Console.
- Render-time debug logs удалены из React-компонентов.
- Logs внутри event handlers, async data loader и bootstrap оставлены: они не выполняются во время
  вычисления JSX.
- Derived values по-прежнему вычисляются в render.

Старые презентационные logs остаются доступными в истории ветки Exercise 5.

## Правило

Render должен быть чистым и идемпотентным: читать текущие props/state, вычислять derived values и
возвращать JSX. Синхронизация с Console, DOM, network, timers и subscriptions выполняется после
commit в effect либо в event handler как результат действия пользователя.

## Почему повторный render опасен для side effect

React может вызвать компонент повторно из-за parent update, изменения state, прерванного concurrent
render или проверки `StrictMode` в development. Если side effect находится в теле компонента, он
может выполниться дважды либо выполниться для UI, который React не committed.

Для Console это означает повторяющиеся или вводящие в заблуждение logs. Для network/storage это могло
бы означать дублированный запрос или запись.

## Является ли derived value side effect

Нет. Например, `getVisibleEvidence(evidence, people, filters)` читает входные данные и возвращает
новый массив, не изменяя props, state или внешнюю систему. Такое чистое вычисление должно оставаться
в render, а не переноситься в effect.

## Как показать Demo

1. Через предыдущий commit показать `debugLog()` в теле `NotesList`.
2. Объяснить, почему Console является внешней системой.
3. В текущем коде показать отсутствие render-time logs.
4. Показать event log в `EvidenceCard`: он выполняется только после пользовательского click.
5. Показать `visibleEvidence` как допустимое чистое вычисление во время render.

