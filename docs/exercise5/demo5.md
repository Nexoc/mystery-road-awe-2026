# Demo 5 — lifting state к общему владельцу

## Что изменено

Раньше bookmark state находился только в `EvidencePage`. Dashboard и Workspace продолжали читать
первоначальный `data.bookmarkIds`, поэтому после toggle показывали устаревшие данные.

Теперь единственный `useState` для bookmark IDs находится в `App` — ближайшем общем предке sibling
routes Dashboard, Evidence и Workspace.

```text
App — владеет bookmarkIds
└── AppRoutes
    ├── DashboardPage — вычисляет count
    ├── EvidencePage
    │   └── EvidenceCard — запрашивает toggle
    └── WorkspacePage — вычисляет bookmarked Evidence
```

При загрузке удаляются повторяющиеся и неизвестные IDs. После toggle готовый новый массив передаётся
в React setter и отдельно записывается в `localStorage`. Запись не выполняется внутри functional
updater или reducer.

## Что означает lifting state механически

1. `useState` удаляется из дочернего `EvidencePage`.
2. Такой же state создаётся выше — в `App`.
3. Текущее значение передаётся вниз через props.
4. Изменение выполняет владелец state.
5. Все потребители получают один новый render из одного источника истины.

Минимальная передача bookmark callback уже необходима, иначе Evidence не сможет запросить изменение
поднятого state. Подробный разбор callback path и второй parent-owned callback относятся к Demo 6.

## Почему нельзя оставить три отдельных `useState`

Dashboard, Evidence и Workspace получили бы три независимых снимка. Toggle в Evidence изменил бы
только один из них. Для синхронизации пришлось бы вручную обновлять остальные copies или повторно
читать storage, что снова создаёт stale и duplicated state.

При единственном владельце:

- Dashboard count всегда равен длине актуального массива;
- Workspace list всегда фильтруется по тому же массиву;
- повторная загрузка восстанавливает массив из `localStorage`;
- Context пока не используется — он относится к Demo 8.

## Как показать Demo

1. В Evidence включить bookmark.
2. Без reload перейти на Dashboard и показать новый count.
3. Перейти в Workspace и показать тот же Evidence.
4. Вернуться в Evidence и выключить bookmark.
5. Обновить страницу и доказать, что значение сохранилось.
6. В коде проследить state от `App` до трёх routes.
