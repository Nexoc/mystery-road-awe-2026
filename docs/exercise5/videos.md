# Задание 5 — видео, что изучить и что показать

Это отдельный учебный маршрут к `EXERCISE_5.md`. Все пояснения здесь на русском. Большинство видео
тоже на русском; официальная документация React на английском используется как точный первичный
источник и при необходимости читается с переводчиком браузера.

Не нужно смотреть всё сразу. Перед каждой Demo:

1. посмотреть только указанный фрагмент;
2. прочитать короткий официальный раздел;
3. выполнить соответствующую часть [плана](plan.md);
4. повторить объяснение своими словами;
5. провести короткую репетицию вживую.

Важное ограничение: `useEffect` относится к заданию 6. В этом маршруте он не нужен ни для загрузки,
ни для автоматической записи в `localStorage`.

## Базовый набор видео

Эти материалы переиспользуются в нескольких Demo:

1. [События в React: `onClick`, `onChange`, `onSubmit` — Friendly Frontend](https://youtu.be/SHDsVFMLtAQ)
2. [Состояние компонента: `useState` и иммутабельность — Friendly Frontend](https://youtu.be/iHQ7fwXTqik)
3. [Управляемые и неуправляемые компоненты — Friendly Frontend](https://youtu.be/heBRA9LVpsA)
4. [Контекст и избавление от prop drilling — Friendly Frontend](https://youtu.be/ryYneS2SFso)
5. [Менеджмент состояния: `useReducer`, `useState`, `useContext` — Friendly Frontend](https://youtu.be/B72gtyI0kPI)
6. [Безопасность React и опасность raw HTML — Friendly Frontend](https://youtu.be/AwMFWuUJXnk)
7. [React DevTools на практике — Friendly Frontend](https://youtu.be/tTvbc1x6Jao)

---

## 5.1 — события в React

Основное видео:
[События в React: клики, ввод текста и отправка форм](https://youtu.be/SHDsVFMLtAQ).

Смотреть:

- `00:43–03:41` — модель React events;
- `03:41–08:10` — `onClick`;
- `08:10–13:55` — изменение controls;
- `13:55–17:17` — `onSubmit` и `preventDefault`.

Официальная сверка:
[Responding to Events — React](https://react.dev/learn/responding-to-events) и
[React event object](https://react.dev/reference/react-dom/components/common#react-event-object).

### Что понять

- handler передаётся как функция: `onClick={handleClick}`;
- `onClick={handleClick()}` вызывает функцию уже во время render;
- event приходит первым аргументом;
- `stopPropagation()` и `preventDefault()` решают разные задачи;
- callback можно определить у родителя и передать ребёнку;
- React event имеет DOM-подобный API, но предоставляет и `nativeEvent`.

### Как применить в Project ReMotion

- bookmark button → `onClick`;
- Evidence card → `onClick` с конкретным ID в URL;
- Close detail → удаление ID из URL;
- note save → `onSubmit`;
- Evidence search целиком переносится в Demo 2, чтобы сразу сделать его controlled;
- больше не нужны inline `onclick` и ручные `addEventListener`.

### Что показать на демонстрации

1. Нажать bookmark.
2. Открыть и закрыть detail.
3. Сохранить note.
4. Открыть код и показать три JSX handlers.
5. Сравнить их со старым delegated listener в vanilla Evidence.

---

## 5.2 — `useState` и controlled forms

Основные видео:

- [Состояние компонента в React](https://youtu.be/iHQ7fwXTqik), смотреть `00:41–10:16`;
- [Управляемые и неуправляемые компоненты](https://youtu.be/heBRA9LVpsA), смотреть целиком;
- дополнительно: [Формы в React без сторонних библиотек](https://youtu.be/pofiCNm5-U4).

Официальная сверка:

- [`<input>` — controlled input](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable);
- [`<select>` и multiple select](https://react.dev/reference/react-dom/components/select);
- [`<textarea>`](https://react.dev/reference/react-dom/components/textarea);
- [`useState`](https://react.dev/reference/react/useState).

### Что понять

- controlled control получает текущее значение из React-state;
- `onChange` создаёт следующее state-значение;
- `value` без обновляющего handler делает поле фактически read-only;
- браузер возвращает range value строкой;
- `multiple select` использует массив строк в `value`;
- state после setter меняется только для следующего render.

### Как применить

- search: `value={searchTerm}`;
- hypothesis select/textarea/range/multiple select: все значения из одного draft object;
- `onSubmit` сохраняет уже готовый draft, а не перечитывает DOM;
- initial draft читается без `useEffect`.

### Что показать на демонстрации

- ввод в search и два textarea;
- изменение range с живым числом рядом;
- выбор нескольких Evidence;
- временный controlled input без `onChange`, затем исправление;
- перезагрузку страницы после сохранения draft.

---

## 5.3 — иммутабельные обновления

Основное видео:
[Состояние компонента в React](https://youtu.be/iHQ7fwXTqik).

Смотреть:

- `10:16–11:54` — создание нового массива;
- `11:54–13:03` — удаление через non-mutating operation;
- `13:03–14:37` — изменение элемента без мутации.

Официальная сверка:

- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state);
- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state);
- [`useState`: сравнение через `Object.is`](https://react.dev/reference/react/useState#set-functions-like-setsomething-nextstate).

### Что понять

- `push`, `splice`, прямое присваивание и `.sort()` меняют существующее значение;
- `filter`, `map`, spread и `slice` создают новые containers;
- одной поверхностной копии массива недостаточно, если затем мутировать общий object внутри;
- изменяемый item тоже нужно заменить новым object;
- React может пропустить state update, если следующее значение `Object.is`-равно предыдущему.

### Как применить

- bookmark toggle: `filter` или `[...ids, id]`;
- status/relevance: `map` плюс `{ ...item, status }`;
- notes: новый record через spread;
- sort: `[...filtered].sort(...)`.

### Что показать на демонстрации

- старый vanilla `state.bookmarks.push(...)`;
- новый bookmark update;
- новую ссылку массива и нового изменённого объекта;
- исходный Evidence order до и после разных сортировок.

---

## 5.4 — derived values вместо лишнего state

Видео для общей картины:
[Менеджмент состояния без Redux](https://youtu.be/B72gtyI0kPI).

Смотреть:

- `00:39–03:40` — где живут данные и почему разрозненные updates становятся проблемой;
- `14:50–17:09` — когда достаточно `useState`, Context или reducer.

Главный официальный материал:
[Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).

### Что понять

- redundant value не следует хранить, если его можно вычислить из props/state;
- duplicated facts могут начать противоречить друг другу;
- render — нормальное место для небольших `filter`, `map`, count и lookup;
- `useMemo` кэширует вычисление, но не превращает derived value в state и не нужен автоматически.

### Как применить

```text
evidence + filters → visibleEvidence
bookmarkIds        → bookmarkCount
evidence + IDs     → bookmarkedEvidence
evidence + notes   → visibleNotes
URL item ID        → selectedEvidence
```

### Что показать на демонстрации

- отсутствие setter для `visibleEvidence`;
- изменение одного filter и немедленно новый список;
- bookmark toggle и два новых derived результата: Dashboard count и Workspace list;
- отсутствие `state.filteredEvidence` в React-коде.

---

## 5.5 — подъём состояния

Основной официальный материал:
[Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

Видео-подготовка:
[Контекст и prop drilling](https://youtu.be/ryYneS2SFso). На этом этапе смотреть начало и остановиться
до окончательного перехода на Context: сначала нужно понять проблему общего владельца и props.

### Что понять

- для каждого факта выбирается один источник истины;
- shared state перемещается к ближайшему общему ancestor;
- значение идёт вниз через props;
- изменения запрашиваются через callbacks;
- lifting state не означает «положить всё наверх».

### Как применить

Ближайший общий владелец bookmarks находится над sibling routes Dashboard, Evidence и Workspace.
Сначала state живёт в `App`, а Context появляется только в Demo 8.

### Что показать на демонстрации

1. Где bookmark state был до переноса.
2. Где он находится после переноса.
3. Toggle в Evidence.
4. Новый count на Dashboard.
5. Тот же item в Workspace.

---

## 5.6 — callbacks вниз

Повторить часть видео:
[События в React](https://youtu.be/SHDsVFMLtAQ), особенно передачу handlers и обработку клика.

Официальная сверка:

- [Passing event handlers as props](https://react.dev/learn/responding-to-events#passing-event-handlers-as-props);
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).

### Что понять

- props read-only;
- ребёнок не должен менять объект из props;
- callback описывает допустимое действие, например `onToggleBookmark(id)`;
- setter остаётся у владельца;
- явный callback обычно легче проследить, чем скрытая мутация или случайное bubbling.

### Что показать на демонстрации

- полный путь `onToggleBookmark` от setter до `EvidenceCard`;
- второй путь `onSaveNote` или `onUpdateEvidence`;
- количество промежуточных уровней;
- честный ответ, стал ли prop drilling проблемой именно здесь.

---

## 5.7 — `useReducer`

Основное видео:
[Менеджмент состояния: `useReducer`, `useState`, `useContext`](https://youtu.be/B72gtyI0kPI).

Смотреть:

- `03:40–12:48` — reducer, actions и dispatch;
- `14:50–17:09` — критерии выбора state-инструмента.

Короткая альтернатива:
[Учим `useReducer` за 14 минут — Влад Калачев](https://www.youtube.com/watch?v=44qqbKsFtkw).

Официальная сверка:

- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer);
- [`useReducer` reference](https://react.dev/reference/react/useReducer).

### Что понять

- action описывает, что произошло;
- reducer чисто вычисляет следующий state;
- `dispatch` планирует update для следующего render;
- reducer не читает DOM, storage и текущее время;
- связанный state и общий reset — хороший случай для reducer;
- reducer не нужен для каждой строки или boolean.

### Как применить

- один state object из семи полей;
- `SET_FILTER`, `SET_SORT`, `CLEAR_FILTERS`;
- TypeScript discriminated union;
- `CLEAR_FILTERS` возвращает один `initialEvidenceFilters`.

### Что показать на демонстрации

- reducer и action types;
- изменение search и двух filters;
- sort;
- один dispatch, очищающий все значения;
- доказательство, что reducer state не содержит готовый Evidence list.

---

## 5.8 — Context и когда его не применять

Основное видео:
[Контекст в React: `useContext` и избавление от prop drilling](https://youtu.be/ryYneS2SFso), смотреть
целиком.

Дополнительный фрагмент:
[Менеджмент состояния без Redux](https://youtu.be/B72gtyI0kPI), `12:48–17:09`.

Официальная сверка:

- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context);
- [`useContext`](https://react.dev/reference/react/useContext);
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context).

### Что понять

- Context доставляет value через дерево;
- Context object сам по себе не хранит state;
- актуальное значение определяет ближайший Provider сверху;
- consumers обновляются при изменении Provider value;
- composition и обычные props часто проще;
- большой общий Context может стать unnecessary global state.

### Как применить

- создать узкий `BookmarkContext`;
- Provider оставить над routes;
- filters и hypothesis не выносить в него;
- сравнить финальный Context с предыдущим prop-drilled commit.

### Что показать на демонстрации

- Provider;
- custom hook `useBookmarks`;
- consumer в Dashboard, Evidence и Workspace;
- отсутствие bookmark props у промежуточных компонентов;
- честный архитектурный trade-off.

---

## 5.9 — поиск проблем состояния

Основное видео:
[React DevTools на практике](https://youtu.be/tTvbc1x6Jao), смотреть целиком или разделы Components и
проверки props/state.

Главный официальный материал:
[Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).

### Что понять

- duplicated state — один факт хранится дважды;
- stale state — сохранённый снимок больше не соответствует источнику;
- prop drilling — не любая передача props, а реально неудобная сквозная передача;
- Context может оказаться ненужным глобальным состоянием;
- mutation часто проявляется только после другого render;
- React DevTools помогает увидеть владельца, props, hooks и context.

### Что показать на демонстрации

Для двух настоящих проблем:

1. состояние до исправления;
2. симптом или способ обнаружения;
3. категорию;
4. исправление;
5. проверку после исправления.

Хорошие ожидаемые кандидаты проекта — stale Dashboard bookmark count и duplicated bookmark/selected
Evidence state, но итоговый выбор должен соответствовать реально существовавшему коду. Журнал таких
находок ведётся с Demo 1: ошибку нужно исправлять сразу, а в Demo 9 показать её через commits и записи,
не сохраняя дефект специально.

---

## 5.10 — отказ от ручного DOM и финальная проверка

Основное видео:
[Безопасность в React: XSS и raw HTML](https://youtu.be/AwMFWuUJXnk).

Смотреть:

- `00:55–02:46` — XSS на примере;
- `02:46–05:48` — опасность raw HTML;
- `05:48–06:34` — безопасный обычный JSX output.

Официальная сверка:
[Common components: `dangerouslySetInnerHTML`](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html).

### Что понять

- JSX text values экранируются React;
- `innerHTML` и `dangerouslySetInnerHTML` обходят безопасный обычный путь;
- class/UI должен зависеть от state/props, а не от `classList`;
- список строится через `.map()`, а не HTML-строку;
- visibility выражается условным render или `className` из state;
- поиск корневого элемента во входном файле — не то же самое, что ручное управление DOM
  представления.

### Что показать на демонстрации

- поиск DOM API по `src/react`;
- отсутствие результатов в `src/react/features`;
- заметка с HTML-like строкой отображается как текст;
- все пять routes;
- полный сценарий search → bookmark → Dashboard → Workspace → перезагрузка;
- чистые Console, typecheck, lint и build.

---

## Сценарий итоговой видеодемонстрации

Если нужно записать одно итоговое видео, лучше не делать десять изолированных повторов. Использовать
один сквозной кейс длиной примерно 12–18 минут.

### 1. Вступление

- показать `EXERCISE_5.md` и десять Demo;
- коротко назвать прежние риски: устаревший count, дублирование bookmarks, mutation и ручной DOM;
- открыть React-версию через `/?react=1`.

### 2. Работа с Evidence

- найти Evidence;
- включить несколько filters и sort;
- очистить всё одним reducer action;
- открыть detail;
- изменить status/relevance;
- сохранить заметку;
- включить bookmark.

### 3. Общий state

- перейти на Dashboard и показать пересчитанные значения;
- перейти в Workspace и показать bookmark/note;
- в коде показать владельца состояния, путь callback и Context Provider.

### 4. Управляемая форма гипотезы

- заполнить select, multiple select, range и оба textarea;
- сохранить draft;
- перезагрузить страницу и показать восстановление.

### 5. Архитектура

- показать filter reducer и три actions;
- показать immutable update;
- показать derived list/count;
- назвать две исправленные state-проблемы;
- объяснить trade-off Context против props.

### 6. Финал

- выполнить DOM API search;
- показать безопасный JSX note output;
- запустить проверки;
- открыть все пять routes и неизвестный route.

## Чек-лист перед записью

- [ ] `localStorage` приведён к известному состоянию.
- [ ] Подготовлена одна Evidence для detail/note/bookmark.
- [ ] Известны две реальные проблемы для Demo 9.
- [ ] Открыты нужные файлы и React DevTools.
- [ ] Browser Console очищена.
- [ ] Нет лишних вкладок и личных данных на экране.
- [ ] Шрифт редактора и браузера читаем.
- [ ] Все npm-проверки проходят.
- [ ] Проведена одна репетиция с таймером.

## Короткая шпаргалка терминов

- **Controlled input** — value задаёт React-state, изменение идёт через handler.
- **Immutable update** — новое значение создаётся без изменения старого.
- **Единый источник истины** — у одного факта один владелец.
- **Derived value** — значение вычисляется из текущих props/state.
- **Lifting state up** — перенос shared state к ближайшему общему ancestor.
- **Callback prop** — функция, через которую ребёнок запрашивает изменение у владельца.
- **Reducer** — чистая функция `state + action → next state`.
- **Dispatch** — отправка action reducer-у.
- **Context** — доставка value глубже по дереву без промежуточных props.
- **Prop drilling** — сквозная передача props через компоненты, которым они сами не нужны.
- **Stale state** — сохранённое значение больше не отражает актуальный источник.
- **Duplicated state** — один факт хранится в нескольких местах.
