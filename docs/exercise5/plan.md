# Задание 5 — анализ и план выполнения

Этот файл — рабочий учебный план по `EXERCISE_5.md`. Сейчас он описывает будущую реализацию, но не
заменяет её: код задания 5 пока не пишется, чекбоксы в исходном задании не отмечаются.

Цель упражнения — закончить React-миграцию приложения: перенести Evidence Catalogue и Workspace,
связать все пять представлений единым реактивным состоянием и убрать ручное управление DOM из
React-ветки приложения.

## 1. Что уже есть в проекте

- React 19, TypeScript, Vite и React Router уже настроены.
- React-оболочка и маршруты работают через `/?react=1`.
- Dashboard, People & Locations и Timeline уже реализованы на React.
- `/evidence` и `/workspace` пока показывают `PlaceholderPage`.
- JSON загружается до первого React-render в `src/react/data.ts`; добавлять `useEffect` для загрузки
  в этом упражнении не нужно.
- Начальные ID закладок уже читаются из `localStorage`.
- В `styles.css` уже есть основная разметка и стили для Evidence, detail view, Workspace и формы
  гипотезы.
- Vanilla-реализации в `src/modules/evidence/evidence.ts` и
  `src/modules/workspace/workspace.ts` можно использовать как описание поведения, но не как код для
  прямого копирования.

## 2. Что обнаружено при анализе

### Проблемы, которые должно устранить задание 5

1. `DashboardPage` считает закладки через первоначальный `data.bookmarkIds.length`. После будущего
   переключения закладки это значение станет устаревшим, если не передать Dashboard живое состояние.
2. В vanilla-версии одна и та же закладка представлена дважды: в `state.bookmarks` и в
   `evidence.bookmarked`.
3. Vanilla-версия хранит `state.filteredEvidence`, хотя этот список полностью вычисляется из полного
   массива и текущих фильтров.
4. `push`, присваивания `ev.bookmarked`, `ev.status` и `ev.relevance` напрямую изменяют существующие
   массивы и объекты.
5. После каждого ручного render Evidence снова вызывает `addEventListener` на контейнере.
6. Evidence и Workspace строят интерфейс строками через `innerHTML`; текст заметки тоже вставляется
   как HTML.
7. Форма гипотезы читает значения обратно из DOM, а не из React-state.
8. Старый переход Workspace → Evidence использует ручную навигацию и `setTimeout`, чтобы дождаться
   DOM. В React это лучше выразить маршрутом, например `/evidence?item=E01`. Параметр `item` при этом
   становится единственным источником выбранного ID; отдельный `selectedEvidenceId` не создаётся.

### Важное толкование финального требования

Фраза «zero manual DOM manipulation anywhere» относится к пяти React-представлениям. Сохранённая
vanilla-версия специально нужна для сравнения с прошлыми упражнениями и по-прежнему содержит DOM API.
Инфраструктурный поиск корневого элемента в `src/react/main.tsx` также не является ручной отрисовкой
представления.

Предыдущие учебные планы явно сохраняют два режима: `/` для vanilla и `/?react=1` для React. Это
базовое предположение данного плана. Перед сдачей нужно сверить ожидание преподавателя: если после
полной миграции React должен стать режимом по умолчанию, переключить bootstrap отдельным финальным
шагом, а legacy-версию оставить за явным параметром вроде `?vanilla=1`. Без такого подтверждения
режим запуска не менять.

## 3. Границы упражнения

### Входит в задание 5

- React-страницы Evidence и Workspace;
- события, `useState`, controlled inputs и controlled form;
- иммутабельные изменения;
- производные значения;
- подъём состояния и callbacks;
- `useReducer` для Evidence filters;
- Context для закладок;
- сохранение bookmarks, notes и hypothesis draft в `localStorage`;
- аудит состояния и удаление ручного управления DOM из кода React-представлений.

### Не входит

- загрузка данных через `useEffect` — это задание 6;
- backend;
- автоматические тесты;
- Redux или другая state-библиотека;
- полная переработка дизайна;
- удаление учебной vanilla-версии;
- новая интерактивность Timeline, если она не нужна для требований задания 5.

## 4. Итоговая модель состояния

Для каждого факта должен существовать один владелец. Остальные значения вычисляются во время render.

| Данные                                      | Итоговый владелец                 | Почему это state                               | Кто читает                     |
| ------------------------------------------- | --------------------------------- | ---------------------------------------------- | ------------------------------ |
| Evidence с изменяемыми `status`/`relevance` | `App`                             | пользователь меняет записи                     | Dashboard, Evidence, Workspace |
| ID закладок                                 | `BookmarkProvider` над routes     | меняются из Evidence и нужны трём routes       | Dashboard, Evidence, Workspace |
| Заметки по Evidence ID                      | `App`                             | меняются в Evidence и показываются в Workspace | Evidence, Workspace            |
| Фильтры и сортировка Evidence               | `EvidencePage` через `useReducer` | локальное состояние одного экрана              | Evidence toolbar/list          |
| Выбранная Evidence                          | URL-параметр `item` в Router      | пользователь открывает/закрывает detail        | Evidence detail                |
| Черновик гипотезы                           | `WorkspacePage`                   | локальная редактируемая форма                  | Hypothesis form                |
| Сообщение о сохранении                      | `WorkspacePage`                   | временное UI-состояние                         | Hypothesis form                |
| Текущий route                               | React Router                      | уже управляется Router                         | App shell                      |

Следующие значения не хранятся в state:

- filtered/sorted evidence;
- количество закладок;
- список bookmarked evidence;
- список заметок для Workspace;
- выбранный объект Evidence — он находится по ID из URL;
- подпись текущего confidence value.

Они вычисляются из актуальных props/state при каждом render. Для текущего маленького набора данных
`useMemo` не нужен; его можно добавлять только после измерения реальной проблемы.

## 5. Целевая структура файлов

Названия можно немного изменить во время реализации, но обязанности должны остаться такими:

```text
src/react/
├── app/
│   ├── App.tsx
│   └── routes.tsx
├── state/
│   └── BookmarkContext.tsx
├── features/
│   ├── evidence/
│   │   ├── EvidencePage.tsx
│   │   ├── evidenceFilters.ts
│   │   └── components/
│   │       ├── EvidenceToolbar.tsx
│   │       ├── EvidenceCard.tsx
│   │       ├── EvidenceList.tsx
│   │       └── EvidenceDetail.tsx
│   └── workspace/
│       ├── WorkspacePage.tsx
│       ├── hypothesis.ts
│       └── components/
│           ├── BookmarksList.tsx
│           ├── NotesList.tsx
│           └── HypothesisForm.tsx
└── shared/
    └── components/
        └── Badge.tsx

src/shared/
└── persistence.ts
```

`src/shared/persistence.ts` должен быть независим от vanilla `state`. Он становится единственным
местом для storage keys и чистых функций чтения/записи. Существующий `src/shared/storage.ts` остаётся
legacy-адаптером и вызывает эти функции, а `src/react/data.ts` удаляет собственные дубликаты ключа и
loader-а закладок. React-код не должен импортировать `src/app/state.ts` или что-либо из `src/modules`.

После загрузки Evidence начальные bookmark IDs дополнительно нормализуются: удаляются повторы и IDs,
которых нет в загруженном наборе Evidence. Поэтому повреждённый, но формально строковый массив из
`localStorage` не завысит Dashboard count.

## 6. Правила реализации до начала Demo

- Одна законченная Demo — один понятный commit. Git-команды выполняет владелец репозитория.
- Если реальная ошибка появляется во время работы, её before/after сохраняются в истории. Не нужно
  специально оставлять или искусственно добавлять известный дефект ради Demo 9.
- Reducer и state updater остаются чистыми: внутри них нет `localStorage`, логирования или других
  side effects.
- Запись в `localStorage` выполняется в обработчике после вычисления следующего значения.
- Массив из props/state никогда не сортируется напрямую: сначала `[...items]`, затем `.sort()`.
- Пользовательский текст выводится обычным JSX: `{note}`. `dangerouslySetInnerHTML` не используется.
- Все обработчики имеют TypeScript-типы; `any` не добавляется.
- `Evidence.bookmarked` сохраняется только ради совместимости vanilla-типа, но React его игнорирует.
  Единственный источник истины React-версии — нормализованный массив bookmark IDs.
- С Demo 1 вести короткий журнал аудита: проблема, категория, commit до исправления, исправление и
  проверка. Demo 9 затем обобщает реальные находки, а не создаёт новые ошибки.

---

## Demo 1 — перенос событий из vanilla в React

### Результат

Маршруты `/evidence` и `/workspace` перестают быть заглушками. Их статическая структура и минимум
три настоящих взаимодействия принадлежат React.

### Шаги

1. Создать `EvidencePage`, toolbar, список карточек и detail section.
2. Создать `WorkspacePage`, списки bookmarks/notes и разметку формы гипотезы.
3. Подключить страницы в `routes.tsx` вместо `PlaceholderPage`.
4. Перенести минимум три события:
   - bookmark: `onClick` кнопки карточки;
   - open/close detail: обработчики карточки и кнопки закрытия;
   - save note: `onSubmit` формы заметки.
5. Поиск целиком оставить для Demo 2, где его `onChange` сразу станет частью controlled input.
6. Клик по карточке передаёт конкретный `evidence.id` в URL-параметр `item`, а не ищет `data-id`
   через DOM; Close удаляет этот параметр.
7. Клик по звезде вызывает `event.stopPropagation()`, если вся карточка тоже кликабельна.
8. Проверить, что в новых feature-файлах нет inline-строк `onclick`, `addEventListener` и чтения
   элементов через `document.*`.

### Что показать на демонстрации

- три JSX handlers в настоящем коде;
- bookmark, открытие/закрытие detail и сохранение заметки в браузере;
- старые vanilla handlers рядом для сравнения;
- поиск по React feature-файлам без `addEventListener` и `onclick`.

### Что нужно уметь объяснить

- В React функция передаётся как prop: `onClick={handleClick}`, а не вызывается во время render.
- React handler получает React event object с привычным DOM-подобным API и доступом к
  `nativeEvent`; это не обязательно тот же объект, который напрямую получает vanilla listener.
- Ручное делегирование одного listener на Evidence container больше не нужно для исправления
  повторной регистрации. React сам управляет подписками и связывает handler с JSX-элементом.
- Bubbling всё ещё существует и может использоваться намеренно, но это отдельное архитектурное
  решение, а не обязательный обходной путь.

### Готово, если

- [ ] обе страницы видимы на React routes;
- [ ] работают минимум три React event handlers;
- [ ] в React-разметке нет строковых handlers;
- [ ] можно объяснить отличие React event от native event.

---

## Demo 2 — `useState` и controlled forms

### Результат

Поиск Evidence и вся hypothesis form управляются React-state.

### Шаги

1. Сделать search input controlled: `value` приходит из state, `onChange` обновляет state.
2. Описать полный `HypothesisDraft` без неопределённых полей:
   - `suspectId: string`;
   - `nature: string`;
   - `evidenceIds: string[]`;
   - `confidence: number`;
   - `explanation: string`;
   - `alternative: string`.
3. Хранить форму одним объектом `useState`, потому что поля образуют один черновик и сохраняются
   вместе.
4. Для `multiple select` получать IDs через `event.currentTarget.selectedOptions`.
5. Для range преобразовывать строку браузера в число.
6. Обработать `onSubmit`, вызвать `preventDefault()` и сохранить черновик.
7. Показать `Saved` декларативно через state, без `classList`.
8. Загрузить начальный draft через чистую функцию чтения storage или lazy initializer, не через
   `useEffect`.

### Учебный эксперимент

Временно оставить controlled input с `value`, но без `onChange`. Убедиться, что ввод не меняет
отображаемое значение, объяснить новый render и вернуть handler до commit.

### Почему для формы один объект, но для filters позже reducer

У hypothesis form пока один основной переход: заменить конкретное поле и сохранить весь черновик.
У filters есть несколько разных команд, общий reset и более сложная логика переходов. Поэтому объект
с `useState` достаточен для формы, а `useReducer` будет оправдан для filters.

### Готово, если

- [ ] search имеет `value` и `onChange`;
- [ ] все шесть частей hypothesis draft controlled;
- [ ] multi-select хранит массив ID;
- [ ] submit не перезагружает страницу;
- [ ] draft восстанавливается после reload;
- [ ] нет чтения значений формы через `getElementById`.

---

## Demo 3 — иммутабельные обновления

### Результат

Ни один существующий state array/object не изменяется на месте.

### Шаги

1. Сохранить в истории ранний мутирующий пример или показать соответствующий vanilla-фрагмент:
   `bookmarks.push(id)` / `evidence.bookmarked = true`.
2. Реализовать bookmark toggle как создание нового массива:
   - удаление через `filter`;
   - добавление через `[...currentIds, id]`.
3. Обновлять status/relevance через `map` и новый объект `{ ...item, status }`.
4. Обновлять notes map через `{ ...notes, [evidenceId]: text }`.
5. Сортировать только копию отфильтрованного массива.
6. Не помещать запись в storage внутрь reducer или функционального updater: в Strict Mode чистые
   функции могут вызываться повторно в development.

### Что проверить

- после toggle предыдущий и следующий массивы имеют разные ссылки;
- неизменённые Evidence objects сохраняют ссылку, изменённый объект получает новую;
- сортировка не меняет исходный порядок `evidence`;
- UI обновляется без принудительного render.

### Что нужно уметь объяснить

- React сравнивает следующее и предыдущее state-значение через `Object.is`; тот же объект/массив может
  привести к пропуску обновления.
- Даже если другая причина вызвала render и мутация визуально проявилась, общая ссылка уже могла
  незаметно изменить данные в другом месте.
- Копия массива перед `.sort()` устраняет тот же класс ошибки, который был в vanilla master array.

### Готово, если

- [ ] нет `push`, `splice` и прямых присваиваний в существующий state;
- [ ] bookmark toggle возвращает новый массив;
- [ ] Evidence update возвращает новый объект;
- [ ] исходный порядок evidence не меняется после сортировки.

---

## Demo 4 — stored state и derived values

### Результат

В state хранится только минимальный набор фактов, а отображаемые списки и числа вычисляются.

### Шаги

1. Удалить любую React-версию `filteredEvidence` state.
2. На каждом render выполнить цепочку:

   ```text
   полный evidence → filter по текущим controls → копия → sort → visibleEvidence
   ```

3. Dashboard bookmark count вычислять из живого массива bookmark IDs.
4. Workspace bookmarked list вычислять из `evidence` и bookmark IDs.
5. Workspace notes list вычислять из `evidence` и `notesByEvidenceId`.
6. Прочитать `selectedEvidenceId` из URL-параметра `item`, а выбранный объект найти в актуальном
   массиве. Отдельный state для выбранного ID или объекта не создавать.
7. Не добавлять `useMemo` автоматически: сначала доказать, что обычное вычисление слишком дорого.

### Правило выбора state

Значение хранится в state, если оно не может быть однозначно вычислено из текущих props/state и
должно пережить render как результат действия пользователя. Если значение можно вычислить, оно не
должно иметь отдельный setter.

### Почему старые ошибки становятся структурно невозможны

- Нет отдельного bookmark count — нечему забыть обновиться.
- Нет `filteredEvidence` — он не может разойтись с master list.
- Filter создаёт новый массив, а sort работает с копией — master array не получает новый порядок.

### Готово, если

- [ ] filtered/sorted list не хранится;
- [ ] bookmark count не хранится;
- [ ] bookmarked items не хранятся;
- [ ] selected Evidence выводится по URL ID из актуального массива;
- [ ] изменение исходного state сразу меняет все производные значения.

---

## Demo 5 — подъём состояния к общему владельцу

### Результат

Evidence card, Dashboard и Workspace используют одну и ту же bookmark state.

### Поэтапная демонстрация

1. Сначала показать локальный bookmark `useState` в `EvidencePage` и его ограничение.
2. Найти общий ancestor трёх sibling routes — `App`/обёртку над `AppRoutes`.
3. Переместить `useState` туда.
4. Передать актуальные IDs в Dashboard, Evidence и Workspace.
5. Dashboard перестаёт читать неизменяемый `data.bookmarkIds.length` после первого render.
6. На этом этапе использовать обычные props. Context появится только в Demo 8, чтобы сравнение было
   честным.
7. При инициализации удалить повторяющиеся и неизвестные bookmark IDs.
8. При toggle вычислить `nextBookmarkIds`, обновить state и записать именно это значение в storage.

### Что показать на демонстрации

1. Открыть Evidence и включить закладку.
2. Перейти на Dashboard — count уже новый.
3. Перейти в Workspace — та же Evidence присутствует в списке.
4. Обновить страницу — состояние восстановилось из `localStorage`.

### Что нужно уметь объяснить

«Поднять state» означает удалить независимые copies у детей, объявить один `useState` у ближайшего
общего предка и передать value/handlers вниз. Три отдельных `useState` создали бы три независимых
снимка, которые пришлось бы вручную синхронизировать.

### Готово, если

- [ ] bookmark IDs существуют в одном state;
- [ ] три представления читают одно значение;
- [ ] переключение видно после обычной route-навигации без reload;
- [ ] bookmark сохраняется после reload.

---

## Demo 6 — callbacks вниз по дереву

### Результат

Дочерние компоненты запрашивают изменение состояния через callbacks и не получают setter или доступ
к чужим данным напрямую.

### Первый путь: bookmark

```text
App
└─ AppRoutes
   └─ EvidencePage
      └─ EvidenceList
         └─ EvidenceCard → onToggleBookmark(evidenceId)
```

### Второй путь: Evidence update или note

```text
App
└─ AppRoutes
   └─ EvidencePage
      └─ EvidenceDetail → onUpdateEvidence(...) / onSaveNote(...)
```

### Шаги

1. Callback определяется рядом с настоящим setter.
2. Каждый промежуточный компонент получает явно типизированный prop.
3. Ребёнок передаёт минимум данных: ID и новое значение, а не мутирует объект из props.
4. Пройти цепочку в React DevTools и посчитать уровни.
5. Записать честный вывод: цепочка bookmark callback уже заметна, но пока ещё управляема.

### Что callback даёт архитектуре

- один владелец решает, как изменять state и сохранять его;
- ребёнок не знает расположение владельца и не мутирует props;
- data flow можно проследить сверху вниз, а событие — снизу вверх через явный вызов;
- callback легко заменить Context API в следующей Demo, не меняя смысл действия.

### Готово, если

- [ ] bookmark callback проходит сверху до карточки;
- [ ] есть второй parent-owned interaction;
- [ ] setters не раздаются произвольным детям;
- [ ] известна точная глубина prop drilling.

---

## Demo 7 — `useReducer` для search/filter/sort

### Результат

Семь связанных значений Evidence toolbar управляются одним reducer.

### State

```ts
type EvidenceFilterState = Readonly<{
  searchTerm: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sortOrder: EvidenceSortOrder;
}>;
```

### Actions

Минимальный discriminated union:

- `SET_FILTER` — search/type/person/location/status/relevance;
- `SET_SORT` — один допустимый sort order;
- `CLEAR_FILTERS` — возврат всего объекта к `initialEvidenceFilters`.

Можно иметь отдельный `SET_SEARCH`, но обязательные три разных типа действий всё равно должны быть
видны.

### Шаги

1. Вынести `initialEvidenceFilters`, action types и reducer в `evidenceFilters.ts`.
2. Сделать reducer чистым и exhaustive; неизвестный action не должен тихо портить state.
3. Заменить отдельные setters на `dispatch`.
4. `CLEAR_FILTERS` возвращает единый начальный объект, включая начальный порядок сортировки.
5. Filter/sort functions оставить чистыми и независимыми от reducer.
6. Reducer ничего не пишет в storage и не читает DOM.

### Почему reducer здесь оправдан

- значения относятся к одному toolbar domain;
- переходы повторяются в нескольких handlers;
- общий reset должен быть атомарным и полным;
- action показывает намерение, а update logic находится в одном месте.

`useState` и `useReducer` концептуально используют одну модель: событие планирует следующее состояние,
после чего React делает новый render. `useReducer` не является отдельным глобальным store; он только
централизует вычисление следующего состояния.

### Готово, если

- [ ] один `useReducer` управляет всеми семью значениями;
- [ ] есть минимум три action types;
- [ ] `CLEAR_FILTERS` сбрасывает всё согласованно;
- [ ] reducer возвращает новые значения и остаётся чистым;
- [ ] visible list по-прежнему derived, а не часть reducer state.

---

## Demo 8 — Context и его границы

### Результат

Prop-drilled bookmarks заменены узким `BookmarkContext`.

### Шаги

1. Сохранить рабочую prop-версию в предыдущем commit.
2. Создать `BookmarkContext` с точным API:
   - `bookmarkIds`;
   - `isBookmarked(id)` или проверка через IDs;
   - `toggleBookmark(id)`.
3. Создать `BookmarkProvider` над `AppRoutes`.
4. Добавить `useBookmarks()` с понятной ошибкой, если consumer находится вне Provider.
5. Перевести Dashboard, Evidence и Workspace на context.
6. Удалить только промежуточные bookmark props. Остальные props оставить явными.
7. Не складывать filters, hypothesis и весь investigation data в один «глобальный» context.

### Честное решение для этого проекта

Для текущей глубины prop drilling обычные props ещё допустимы и даже легче прослеживаются. Context
оправдан учебным требованием и тем, что bookmarks нужны трём sibling routes и вложенной карточке. В
production-версии такого размера оба решения разумны; узкий bookmark context приемлем, а общий
`GlobalAppContext` был бы избыточным.

### Что Context решает и чего не решает

- Решает доставку value через промежуточные уровни без повторяющихся props.
- Не выбирает владельца state.
- Не обеспечивает автоматически reducer, persistence, validation или immutable updates.
- Не делает данные «глобальной переменной»: значение доступно только внутри конкретного Provider.
- Все consumers обновляются при изменении context value, поэтому context не нужно расширять без
  необходимости.

### Готово, если

- [ ] Provider реально используется;
- [ ] bookmark props удалены с промежуточных компонентов;
- [ ] все три views получают актуальное значение;
- [ ] можно защитить решение и назвать его минусы.

---

## Demo 9 — аудит типичных проблем состояния

### Результат

Найдены, исправлены и документированы минимум две реальные проблемы. Журнал ведётся с Demo 1,
поэтому дефект можно исправить сразу после обнаружения и затем честно показать через before/after
commits. Известные ошибки не нужно сохранять до Demo 9.

### Матрица аудита

| Категория                | Что искать в проекте                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Duplicated state         | `bookmarked` плюс bookmark IDs; объект selected Evidence плюс тот же объект в массиве |
| Stale state              | Dashboard читает initial `data.bookmarkIds`; detail хранит старую копию Evidence      |
| Excessive prop drilling  | props, которые промежуточный компонент только пересылает                              |
| Unnecessary global state | filters/hypothesis помещены в общий Context без потребителя вне страницы              |
| Mutation                 | `.sort()` на props, `push`, изменение объекта Evidence или notes map                  |

### Вероятные реальные кандидаты

1. **Stale state:** первоначальный Dashboard bookmark count из `data.bookmarkIds`.
2. **Duplicated state:** bookmark flag внутри Evidence вместе с bookmark IDs либо выбранный Evidence
   object вместе с изменяемым master array.

Это кандидаты, а не заранее придуманный отчёт. Если архитектура предотвратила один из них ещё до
появления в React-коде, он не считается исправленной реальной проблемой. Для отчёта выбрать две
находки, которые действительно присутствовали в commit до исправления.

### Как документировать каждую проблему

Для каждой записать:

1. симптом или способ обнаружения;
2. одну из пяти категорий;
3. корневую причину;
4. before-код;
5. исправление;
6. проверку после исправления.

Свести записи в `docs/exercise5/demo9.md`: дата/этап обнаружения, категория, ссылка или hash
before-commit, исправляющий commit и доказательство результата.

Использовать UI, повторное чтение кода и React DevTools. Не считать автоматические тесты
обязательными — они вне scope.

### Готово, если

- [ ] исправлены минимум две реальные проблемы;
- [ ] названа категория каждой;
- [ ] сохранены понятные before/after commits или заметки;
- [ ] объяснена связь с багами Exercise 1.

---

## Demo 10 — финальный DOM sweep и завершение миграции

### Результат

Все пять React views работают через JSX, state, props, Router и Context без ручного изменения DOM.

### Контроль режима запуска

До финальной проверки подтвердить ожидаемый режим запуска:

- если курс продолжает принятую стратегию миграции, `/` остаётся vanilla, а все пять React views
  проверяются через `/?react=1`;
- если преподаватель ожидает завершённую миграцию по умолчанию, React становится `/`, а legacy-режим
  переносится за явный параметр.

Это отдельное решение о запуске. Оно не меняет критерий: внутри React-представлений ручного DOM нет.

### Поиск по React-коду

```bash
rg -n "document\.|querySelector|innerHTML|classList|addEventListener|onclick|dangerouslySetInnerHTML" src/react
```

Допустимое инфраструктурное исключение — поиск `#react-root` в `src/react/main.tsx`. В
`src/react/features` и `src/react/app` результатов ручного DOM manipulation быть не должно.

### Финальная функциональная проверка

1. Открыть `/?react=1#/evidence`.
2. Проверить search, все пять filters, четыре sort orders и Clear filters.
3. Открыть detail, изменить status/relevance и сохранить заметку.
4. Ввести в заметку `<img src=x onerror=alert(1)>` и убедиться, что это отображается текстом.
5. Переключить bookmark.
6. Открыть Dashboard и проверить count/review progress.
7. Открыть Workspace и проверить bookmarks/notes.
8. Заполнить все поля hypothesis, включая multi-select и range, сохранить и сделать reload.
9. Проверить Back/Forward, прямое открытие routes и неизвестный route.
10. Проверить Console на ошибки и warnings.
11. Проверить выбранную и подтверждённую стратегию запуска; при двойном режиме также проверить
    vanilla `/`.

### Архитектурный trade-off для ответа

Подходящий честный пример — Context для bookmarks. Он сокращает prop drilling, но скрывает
зависимость компонента и заставляет всех consumers подписаться на Provider value. Для маленького
приложения props могли бы быть проще; Context выбран узким и не превращён в общий store.

### Структурно предотвращённая ошибка

Устаревший bookmark count больше не существует как отдельное состояние. Он всегда вычисляется из
единого bookmark source во время render. Аналогично filtered Evidence нельзя случайно рассинхронизировать
с master list, потому что отдельной переменной состояния для него нет.

### Готово, если

- [ ] все пять React views доступны;
- [ ] Evidence и Workspace больше не placeholders;
- [ ] код React-представлений не управляет DOM вручную;
- [ ] все данные сразу согласованы между views;
- [ ] данные из storage восстанавливаются после перезагрузки;
- [ ] можно ответить на финальные вопросы своими словами.

## 7. Работа с `localStorage` без `useEffect`

Задание 5 прямо откладывает effects до следующего упражнения. Поэтому используется такая схема:

```text
первый render       → безопасно прочитать и провалидировать storage
действие пользователя → вычислить следующее значение
                     → передать его в React setter
                     → попытаться записать его в storage
следующий render    → UI вычисляется из нового state
```

Нужны чистые helpers:

- `readBookmarkIds()` / `writeBookmarkIds(ids)`;
- `readNotes()` / `writeNotes(notes)`;
- `readHypothesisDraft()` / `writeHypothesisDraft(draft)`.

Каждая read-функция:

- оборачивает `JSON.parse` в `try/catch`;
- проверяет shape значения;
- возвращает безопасное значение по умолчанию при повреждённых данных;
- для bookmarks удаляет дубликаты, а после загрузки Evidence отбрасываются неизвестные IDs.

Каждая write-функция:

- принимает готовое значение;
- ловит storage/quota error;
- позволяет UI показать понятную ошибку вместо падения приложения.

При ошибке записи текущее React-state и UI остаются обновлёнными, но пользователь получает сообщение:
изменение действует в этой сессии и может потеряться после перезагрузки. Молча откатывать интерфейс
или притворяться, что persistence сработал, нельзя.

## 8. Предлагаемая последовательность commits

1. `feat: add React evidence and workspace structure`
2. `feat: control evidence search and hypothesis form`
3. `refactor: update investigation state immutably`
4. `refactor: derive evidence and bookmark views`
5. `refactor: lift shared investigation state`
6. `refactor: pass state callbacks to feature components`
7. `refactor: manage evidence filters with reducer`
8. `refactor: provide bookmarks through context`
9. `fix: remove duplicated and stale React state`
10. `refactor: finish React DOM migration`

Названия — ориентир. Перед каждым commit сначала должна проходить соответствующая проверка вживую.

## 9. Проверки после каждой Demo

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

После code formatting при необходимости сначала выполнить `npm run format`, затем снова все четыре
проверки. `build` уже запускает typecheck, но отдельный запуск оставляет ошибку легче читаемой.

## 10. Сквозной сценарий итоговой демонстрации

Вместо десяти несвязанных показов использовать одну историю:

1. Найти Evidence по поиску.
2. Применить несколько filters и sort.
3. Очистить всё одним reducer action.
4. Открыть карточку и изменить review status.
5. Сохранить заметку.
6. Добавить bookmark.
7. Перейти на Dashboard и показать новый count/progress.
8. Перейти в Workspace и показать ту же закладку и заметку.
9. Заполнить и сохранить hypothesis draft.
10. Перезагрузить страницу и показать восстановление данных.
11. Открыть React DevTools/код и объяснить владельца состояния, callbacks, reducer и Context.

## 11. Итоговые критерии готовности

- [ ] Реализованы обе последние React-страницы.
- [ ] Есть минимум три React event handlers из реального UI.
- [ ] Search и hypothesis form полностью controlled.
- [ ] State обновляется иммутабельно.
- [ ] Filtered/sorted/bookmark-derived данные не дублируются.
- [ ] Bookmarks имеют один источник истины.
- [ ] Сначала продемонстрированы lifted state и callbacks, затем Context.
- [ ] Evidence filters используют один reducer и минимум три action types.
- [ ] Исправлены и объяснены минимум две реальные state-проблемы.
- [ ] Код React-представлений не использует ручное управление DOM.
- [ ] Storage корректно переживает перезагрузку и повреждённые данные.
- [ ] Все npm-проверки проходят.
- [ ] Каждый отмеченный пункт исходного Self-Check можно показать и объяснить вживую.
