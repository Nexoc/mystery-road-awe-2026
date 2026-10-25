# Потом делаю задание 4

Это мой личный учебный план, а не отчёт для преподавателя. Я использую его только после того, как
полностью прошёл [план завершения задания 3](plan-finish-exercise3.md).

Здесь моя цель — не просто скопировать компоненты. Я должен постепенно понять props, `children`,
условия, списки, `key`, границы компонентов и routing.

## Что получится в конце

После задания 4 в React будут готовы три части приложения:

1. Dashboard — из задания 3.
2. People & Locations — новое в задании 4.
3. Timeline — новое в задании 4.

Evidence Catalogue и Workspace останутся React-заглушками. Их интерактивность будет в задании 5.

## Сначала проверяю, можно ли начинать

- [ ] React-shell из задания 3 готов.
- [ ] React Dashboard показывает реальные данные.
- [ ] Есть пять React-направлений, четыре из них пока placeholders.
- [ ] `demo9.md` и `demo10.md` задания 3 готовы.
- [ ] Vanilla `/` и React `/?react=1` работают.
- [ ] Я понимаю props, state, effect и derived values.

Если хотя бы один пункт не выполнен, сначала возвращаюсь к
[предыдущему плану](plan-finish-exercise3.md).

## Главные ограничения задания 4

Во всех новых React-компонентах:

- не использую `innerHTML`;
- не использую `document.createElement`, `appendChild` и ручной `classList`;
- не использую `any` для props;
- не добавляю собственный feature-state через `useState`; внутреннее состояние Router не считается
  нарушением;
- не делаю controlled forms;
- не добавляю reducer или глобальный state;
- не переношу Timeline modal с открытием Evidence;
- не мигрирую Evidence и Workspace раньше задания 5.

Timeline dropdowns должны выглядеть готовыми, но после выбора пока могут не фильтровать список. Это
не ошибка: настоящее взаимодействие будет позже.

## Как я прохожу задание

Чтобы не видеть десять Demo как десять несвязанных тем, делю работу на три понятных блока:

1. **Demo 1–4 — учусь строить UI:** компоненты, props, условия, списки и `key`.
2. **Demo 5–7 — навожу порядок:** разделяю ответственности, раскладываю файлы и выношу только
   действительно общий UI.
3. **Demo 8–10 — связываю UI с URL:** Router, страница конкретного человека и начальный фильтр
   Timeline.

Внутри каждой Demo сначала читаю идею, потом делаю изменение, проверяю браузер и только затем
проговариваю ответ своими словами.

## Маленький словарь перед началом

### Component

Функция, которая по входным данным возвращает описание UI в JSX.

### Props

Входные данные компонента. Компонент читает их, но не изменяет.

### Children

Содержимое между открывающим и закрывающим тегом компонента:

```tsx
<Panel>
  <TimelineFilters />
</Panel>
```

### Render

Вызов компонента, во время которого React получает новое описание UI. Render не означает, что весь
DOM обязательно будет пересоздан.

### Conditional rendering

Выбор, какой JSX показать: например, список или сообщение «ничего не найдено».

### Key

Стабильная идентичность элемента среди соседей списка. `key` помогает React понять, какая запись
осталась той же самой между renders.

### Presentational component

Получает уже подготовленные данные и отвечает в основном за внешний вид.

### Feature/container component

Знает, откуда взять данные, какой route открыт и что передать маленьким компонентам.

### Route

URL, который соответствует определённой странице приложения.

### Route parameter

Часть пути, которая определяет конкретную сущность: `/team/people/nova-byte`.

### Query parameter

Дополнительная настройка страницы: `/timeline?person=nova-byte`.

---

## Demo 1. JSX, компоненты, typed props и children

### Что я изучаю

- как разделить страницу на маленькие компоненты;
- как TypeScript проверяет props;
- как вставлять JavaScript expressions в JSX;
- когда использовать обычный prop, а когда `children`;
- почему React должен сам владеть своим DOM.

### Что я создаю

Минимум четыре компонента:

- `PersonCard`;
- `LocationCard`;
- `TimelineEventCard`;
- общий `Panel` с `children`.

Если к этому моменту `Panel` уже появился во время задания 3, я не считаю старый файл автоматически
выполненной Demo 1. В задании 4 я либо дорабатываю его typed API и впервые использую в новой
People/Timeline view, либо создаю другой настоящий composition-компонент с `children`.

У каждого компонента props имеют явный тип.

Пример:

```ts
type PersonCardProps = Readonly<{
  person: Person;
  relatedEvidenceCount: number;
}>;
```

Для `Panel`:

```ts
type PanelProps = Readonly<{
  title: string;
  children: ReactNode;
}>;
```

### Что важно понять про JSX

В JSX braces можно поместить выражение, то есть то, что даёт значение:

```tsx
<h3>{person.name}</h3>
<p>{relatedEvidenceCount === 1 ? "1 item" : `${relatedEvidenceCount} items`}</p>
```

Нельзя прямо внутри braces написать statement `if`, `for` или объявление переменной. Такое вычисление
делаю до `return` либо использую expression.

### Named prop или children

Named prop подходит, когда вход имеет конкретный смысл:

```tsx
<StatCard label="People" value={6} />
```

`children` подходит, когда общий компонент задаёт рамку, но не знает внутреннее содержимое:

```tsx
<Panel title="Timeline filters">
  <TimelineFilters />
</Panel>
```

### Как увидеть пользу TypeScript

1. Временно передаю `relatedEvidenceCount="six"`.
2. Запускаю `npm run typecheck`.
3. Читаю сообщение и нахожу неправильный prop.
4. Исправляю число обратно.
5. Снова запускаю typecheck.

Сломанный вариант не оставляю в финальном коде. В `demo1.md` можно сохранить фрагмент и screenshot
ошибки.

### Почему не надо менять DOM вручную

React предполагает, что DOM внутри root изменяет React. Если я отдельно вызову `innerHTML` или
удалю узел через DOM API, реальный DOM перестанет соответствовать тому, что React считает
отрисованным. Следующее обновление может потерять handlers, state или показать неправильный UI.

### Что показать live

- три маленьких компонента с typed props;
- выражение `{person.name}` и одно вычисляемое выражение;
- реальное использование `Panel` с `children`;
- временную ошибку TypeScript и её исправление.

### Я понял Demo 1, если могу объяснить

- Что можно поместить внутрь `{...}`?
- Что TypeScript поймает при неправильных props?
- Чем named prop отличается от `children`?
- Почему React и ручное изменение одного DOM-поддерева конфликтуют?

### Можно идти дальше, если

- [ ] Есть минимум три компонента с typed props.
- [ ] Нет props с `any`.
- [ ] `Panel` с `children` используется в настоящем UI.
- [ ] Type error был показан и исправлен.
- [ ] Я могу ответить на четыре вопроса Demo 1.

---

## Demo 2. Conditional rendering

### Что я изучаю

Один компонент может показать разный JSX в зависимости от данных.

Мне нужны минимум два настоящих случая и минимум две разные техники.

### Случай 1: пустой список

`TimelineEventList` может сделать early return:

```tsx
if (events.length === 0) {
  return <EmptyState message="No timeline events match." />;
}
```

### Случай 2: оформление certainty

Для `confirmed`, `reported` и `contradictory` выбираю разный visual tone badge. Лучше использовать
маленькую функцию соответствия `certainty → tone`, а не длинные вложенные ternary.

### Случай 3: необязательный блок

Локации показываю только при их наличии:

```tsx
{
  locationNames.length > 0 && <p>{locationNames.join(", ")}</p>;
}
```

Проверка `> 0` важна. Если написать `locationNames.length && ...`, при нуле React способен вывести
текстовый `0`.

### Когда вернуть null

Если компонент вообще ничего не должен добавить в DOM, можно вернуть `null`. Пустой `<div>` создаёт
лишний узел, который может влиять на layout и CSS.

В моём коде это можно применить в `TimelineEvidenceLinks`: если у события нет `evidenceIds`, компонент
возвращает `null`, потому что пустая обёртка там не нужна. Если я выберу другое реальное место, в
`demo2.md` обязательно запишу, где именно использовал `null` и почему.

### Что показать live

- список Timeline с событиями;
- empty state на пустом массиве или URL без совпадений;
- разные certainty badges;
- early return и `&&` в коде.

### Я понял Demo 2, если могу объяснить

- Почему `0 && <Component />` опасно?
- Когда `null` лучше пустого `<div>`?
- Почему для empty state удобен early return?
- Почему mapping подходит для badge variants?

### Можно идти дальше, если

- [ ] Есть два реальных conditional cases.
- [ ] Использованы минимум две техники.
- [ ] Условие перед `&&` действительно boolean.
- [ ] Я могу ответить на оба вопроса задания.

---

## Demo 3. Списки через map

### Что я изучаю

React-список обычно строится так:

```text
массив данных → map → массив компонентов
```

### Что я делаю

Три обязательных списка:

```tsx
people.map((person) => <PersonCard key={person.id} person={person} />);
locations.map((location) => (
  <LocationCard key={location.id} location={location} />
));
events.map((event) => <TimelineEventCard key={event.id} event={event} />);
```

Также проверяю вложенные `.map()`:

- responsibilities;
- содержимое locations;
- evidence IDs;
- `<option>` в фильтрах.

У каждого соседнего элемента должен быть стабильный уникальный key.

### Что key делает на самом деле

`key` не нужен для CSS и обычно не приходит компоненту как обычный prop. React использует его во
время reconciliation, чтобы сопоставить старого и нового соседа списка.

### Что показать live

- три разных `.map()`;
- `person.id`, `location.id`, `event.id` в роли keys;
- Console без warning о missing/duplicate key.

### Можно идти дальше, если

- [ ] People рендерятся через `.map()`.
- [ ] Locations рендерятся через `.map()`.
- [ ] Timeline events рендерятся через `.map()`.
- [ ] Во всех трёх случаях используется `id` из JSON.
- [ ] Я понимаю, зачем React нужен key.

---

## Demo 4. Почему key={index} путает записи

### Что я изучаю

Index массива — это позиция, а не идентичность сущности. После сортировки или фильтрации человек
может перейти с позиции 0 на позицию 2, но `key={index}` заставит React считать, что сущность на
позиции 0 всё ещё та же.

### Как сделать безопасный учебный эксперимент

Теорию этой Demo читаю сейчас, а сам эксперимент запускаю после Demo 8, когда React Router уже
установлен. Так мне не нужен дополнительный `useState` только ради демонстрации.

Создаю временный `KeyIdentityDemo`:

1. Показываю три записи с uncontrolled input — обычным полем с `defaultValue`, значение которого
   хранит сам DOM, а не React-state.
2. Временно использую `key={index}`.
3. Меняю текст первого input.
4. Перехожу на учебный route с `?order=reverse` без полного reload.
5. Вижу, что значение input осталось у позиции и теперь относится не к той записи.
6. Меняю key на `item.id`.
7. Повторяю: введённое значение теперь остаётся у правильной записи.

Не добавляю `useState` в product feature. Ошибочный `key={index}` не остаётся в финальном коде.

### Что происходит при плохих keys

- missing key: React предупреждает и не понимает, какая старая запись соответствует новой;
- duplicate key: две записи имеют одну и ту же «личность» для React;
- index key: warning может не быть, но при reorder/filter DOM-state или focus могут перейти к другой
  записи.

### Связь со старым приложением

В старом `src/modules/workspace/workspace.ts` array index использовался как идентификатор note. Если
перенести эту идею как React key, проблема может стать видимой пользователю после удаления, вставки,
фильтрации или перестановки элементов. Это не только вопрос Console warning.

Для защиты открываю и оригинальный вариант через Git, нахожу создание note index и DOM id:

```bash
git show 22cb2d8:app.js
```

### Когда index всё-таки допустим

Только если одновременно:

- список действительно статический;
- элементы никогда не добавляются, не удаляются и не меняют порядок;
- у данных нет стабильного id;
- внутри нет элементов со своим изменяемым состоянием.

В этом проекте у реальных сущностей id уже есть, поэтому index не нужен.

### Что показать live

- видимую путаницу значения input и записи;
- исправление `key={item.id}`;
- before/after diff или два commits;
- правильные keys во всех настоящих списках.

### Можно идти дальше, если

- [ ] Ошибка с index key реально воспроизведена.
- [ ] Я видел пользовательский симптом, а не только warning.
- [ ] В финальном коде используются ids.
- [ ] Я могу объяснить missing, duplicate и index keys.
- [ ] Я знаю редкий случай, когда index допустим.

---

## Demo 5. Где провести границу компонента

### Что я изучаю

Не каждый компонент должен делать всё. Но и разбивать каждую строку на отдельный файл не надо.

Простое правило:

- feature component выбирает/подготавливает данные;
- presentational component показывает уже подготовленные данные.

### Мои примеры

Feature/container:

- `DashboardPage`;
- `PeoplePage`;
- `LocationsPage`;
- `TimelinePage`.

Presentational:

- `PersonCard`;
- `LocationCard`;
- `TimelineEventCard`;
- `TimelineFilters`;
- `Panel`;
- `Badge`;
- `EmptyState`.

Shell/layout можно отметить отдельно: он отвечает за общую рамку и routes.

Здесь классифицирую только уже существующие компоненты. После Demo 9 добавлю в список
`PersonDetailsPage` и отмечу его как feature-компонент.

### Какой компонент разделить

Если первая версия `TimelinePage` делает всё сразу, разделяю её:

```text
TimelinePage
├─ читает query и выбирает события
├─ TimelineFilters показывает controls
└─ TimelineEventList показывает список/empty state
   └─ TimelineEventCard показывает одно событие
```

После разделения изменение разметки фильтров не должно требовать изменения карточки события.

### Что документирую

В `demo5.md` делаю небольшую таблицу всех созданных компонентов:

- название;
- категория;
- одна главная ответственность;
- откуда приходят данные;
- почему компонент находится здесь.

### Я понял Demo 5, если могу объяснить

- Какова одна ответственность каждой части после split?
- Может ли одна часть измениться без изменения другой?
- По какому правилу я отличаю feature от presentational?
- Почему «маленький компонент» не всегда означает «хороший компонент»?

### Можно идти дальше, если

- [ ] Классифицированы все React-компоненты, а не только три примера.
- [ ] Один реально перегруженный компонент разделён.
- [ ] Есть понятный before/after diff.
- [ ] Я могу объяснить границы своими словами.

---

## Demo 6. Разложить файлы по features

### Что я изучаю

Организация by type выглядит так:

```text
components/
pages/
utils/
```

При росте проекта файлы одной функции оказываются далеко друг от друга.

Организация by feature группирует всё, что относится к Dashboard, People или Timeline.

### К какой структуре прийти

Ниже показана финальная структура после подключения Router в Demo 8. Во время Demo 6 перемещаю
только те файлы, которые уже существуют; `routes.tsx` добавлю позже вместе с Router.

```text
src/react/
├─ main.tsx
├─ app/
│  ├─ App.tsx
│  ├─ routes.tsx
│  └─ layout/
│     ├─ AppShell.tsx
│     ├─ Header.tsx
│     ├─ Navigation.tsx
│     └─ Footer.tsx
├─ features/
│  ├─ dashboard/
│  ├─ people-locations/
│  └─ timeline/
└─ shared/
   └─ components/
      ├─ Panel.tsx
      ├─ Badge.tsx
      ├─ EmptyState.tsx
      └─ PlaceholderPage.tsx

src/shared/
├─ data/
└─ utils/
```

Старый `src/modules/` остаётся legacy-кодом для vanilla-версии. React features его не импортируют.

### Как решить shared или feature-local

Компонент остаётся внутри feature, если:

- используется только там;
- знает доменную сущность этой feature;
- его API пока не доказал общность.

Компонент идёт в shared, если:

- реально используется минимум в двух местах;
- его props не содержат специальных flags для одной feature;
- он описывает общий UI-паттерн.

Примеры:

- `TimelineEventCard` — feature-local;
- `Badge` или `Panel` — shared, если действительно используются в нескольких features.

### Что я делаю

1. Сначала убеждаюсь, что всё работает до перемещения.
2. Перемещаю shell, Dashboard, People/Locations и Timeline.
3. Исправляю imports.
4. Не меняю поведение в том же commit.
5. Запускаю проверки.
6. Пишу `docs/exercise4/ARCHITECTURE.md` по фактической структуре.

### Я понял Demo 6, если могу объяснить

- Чем by type отличается от by feature?
- Почему feature structure подходит пяти страницам этого проекта?
- Почему `PersonCard` не shared?
- Почему `Badge` может быть shared?
- Почему React не должен импортировать старые DOM-renderers?

### Можно идти дальше, если

- [ ] Shell и Dashboard тоже включены в новую структуру.
- [ ] Файлы сгруппированы по features.
- [ ] `ARCHITECTURE.md` совпадает с реальными файлами.
- [ ] Есть один понятный shared и один feature-local пример.
- [ ] Build работает после перемещения.

---

## Demo 7. Сделать настоящий reusable UI component

### Что я изучаю

Переиспользование — не создание абстракции «на будущее». Компонент считается реально reusable,
когда он уже нужен минимум в двух местах.

### Хороший вариант: Badge

`Badge` может использоваться:

- в Dashboard для case/evidence status;
- в Timeline для certainty.

Сам `Badge` не должен знать слова `confirmed` или `contradictory`. Timeline feature переводит
domain value в общий visual tone.

Простой API:

```ts
type BadgeProps = Readonly<{
  tone: "neutral" | "success" | "warning" | "critical";
  children: ReactNode;
}>;
```

Фиксированными остаются base markup и CSS class. Через props меняются tone и текст.

`Panel` тоже может быть вторым примером, если используется в Dashboard и Timeline.

### Чего не делать

Плохой shared API:

```text
isTimeline
isDashboard
compactPeople
hideSomething
```

Большое количество специальных flags означает, что компонент на самом деле знает слишком много о
разных features.

### Сравнение со старой vanilla-версией

В старом коде похожая разметка badge/panel собиралась строками в разных функциях. Копия могла начать
отличаться от другой копии.

React-компонент даёт:

- одно место для markup;
- typed contract;
- одинаковое поведение;
- понятные различия через props;
- composition через `children`.

### Что показать live

- один shared component;
- минимум два разных места его использования;
- какие части фиксированы;
- какие значения меняются props;
- старые повторяющиеся HTML strings для сравнения.

### Можно идти дальше, если

- [ ] Компонент реально используется в двух местах.
- [ ] Его API не содержит feature-specific flags.
- [ ] Я могу показать оба места использования.
- [ ] Я могу сравнить это с копированием template strings.

---

## Demo 8. Заменить ручной routing на React Router

### Что я изучаю

Собственный router задания 3 умел только читать hash и выбирать страницу. Библиотека даёт готовые:

- route table;
- links и active links;
- вложенные routes;
- parameters;
- query parameters;
- fallback route;
- работу с browser history.

### Какой router выбрать

Использую `react-router-dom` и `HashRouter`.

Сам Router внутри использует своё состояние для navigation. Это не нарушение задания: я не создаю
новый feature state и не добавляю интерактивные фильтры через `useState`.

Почему `HashRouter` подходит этому проекту:

- приложение размещается на GitHub Pages;
- GitHub Pages не настроен отдавать `index.html` для любого вложенного path;
- часть после `#` не отправляется серверу;
- direct link и reload поэтому не дают 404;
- внешний `?react=1` продолжает выбирать React-версию.

Примеры итоговых URL:

```text
/?react=1#/dashboard
/?react=1#/team/people
/?react=1#/team/locations
/?react=1#/timeline
```

### Что я делаю

1. Устанавливаю `react-router-dom`.
2. Оборачиваю приложение в `HashRouter`.
3. Удаляю собственный `useHashRoute` из задания 3.
4. Создаю routes:

```text
/                         → redirect на /dashboard
/dashboard                → DashboardPage
/evidence                 → placeholder
/team                     → redirect на /team/people
/team/people              → PeoplePage
/team/locations           → LocationsPage
/timeline                 → TimelinePage
/workspace                → placeholder
*                         → NotFoundPage
```

5. Верхнюю navigation делаю через `NavLink`.
6. People/Locations tabs тоже делаю через `NavLink`.
7. Не храню активную tab в `useState`.

### Почему People и Locations должны быть routes

Пользователь получает:

- отдельный URL каждой вкладки;
- bookmark;
- возможность поделиться ссылкой;
- открытие в новой вкладке;
- правильные Back и Forward;
- сохранение страницы после reload.

### Что делать с неизвестным route

Рекомендованный вариант — `NotFoundPage` с объяснением и ссылкой на Dashboard. Это понятнее, чем
старый vanilla fallback, который молча показывал Dashboard.

Можно выбрать redirect, но тогда надо честно объяснить решение и сравнение со старым поведением.

### Важная деталь двух query-частей

В URL:

```text
/?react=1#/timeline?person=nova-byte
```

- `?react=1` до `#` читает bootstrap;
- `?person=nova-byte` внутри hash route читает React Router.

Для Timeline нельзя брать person через обычный `window.location.search`, потому что там находится
внешний `react=1`.

### Что проверить live

- People → Locations меняет URL;
- Back/Forward возвращает вкладки;
- reload сохраняет route;
- copied URL открывает нужную страницу;
- main navigation active и на People, и на Locations;
- invalid route показывает выбранный fallback;
- GitHub Pages/production preview не дают 404.

### Я понял Demo 8, если могу объяснить

- Что router делает вместо моего старого hook?
- Почему tabs как routes полезнее локального state?
- Почему здесь выбран `HashRouter`, а не `BrowserRouter`?
- Что происходит с неизвестным route?

### Можно идти дальше, если

- [ ] Router установлен и подключён.
- [ ] Dashboard, People, Locations и Timeline — реальные routes.
- [ ] Evidence и Workspace всё ещё placeholders.
- [ ] People и Locations имеют разные URLs.
- [ ] Back, Forward, reload и invalid route проверены.
- [ ] Я могу ответить на оба вопроса задания.

---

## Demo 9. Route parameter для конкретного человека

### Что я изучаю

Route parameter — переменная часть path:

```text
/team/people/:personId
```

URL `/team/people/nova-byte` означает страницу конкретного человека.

### Что я делаю

1. Добавляю route `/team/people/:personId`.
2. В `PersonCard` добавляю настоящий `Link` на страницу человека.
3. В `PersonDetailsPage` читаю `personId` через `useParams()`.
4. Помню, что для TypeScript это `string | undefined`.
5. Если значения нет, показываю not-found state.
6. Ищу человека через `people.find(...)`.
7. Если id неизвестен, не падаю и не подставляю первого человека.
8. Показываю ссылку назад к списку.
9. Добавляю ссылку «View on timeline» на query route будущей Demo 10.

Не использую `personId!` или слепое `as string`, потому что это скрывает реальную возможность
`undefined`.

### Route param или query param

```text
/team/people/nova-byte
```

Здесь Nova — основной объект страницы, поэтому route param подходит.

```text
/timeline?person=nova-byte
```

Здесь Timeline остаётся той же страницей, а person только фильтрует её, поэтому query parameter
подходит лучше.

### Что показать live

- перейти в Nova из `PersonCard`;
- увидеть id в URL;
- перезагрузить detail page;
- открыть `/team/people/not-real`;
- увидеть безопасный not-found;
- вернуться Back к списку.

### Я понял Demo 9, если могу объяснить

- Как прочитать route parameter?
- Почему его тип включает `undefined`?
- Как безопасно обработать неизвестный id?
- Почему detail использует path param, а Timeline filter — query param?

### Можно идти дальше, если

- [ ] Parameterized route существует.
- [ ] На него можно перейти кликом из приложения.
- [ ] Valid id показывает правильного человека.
- [ ] Invalid id не вызывает crash.
- [ ] Reload и Back работают.
- [ ] Я могу ответить на оба вопроса задания.

---

## Demo 10. Query parameter и финальная проверка

### Что я изучаю

Query parameter меняет начальное отображение страницы, но не определяет новую сущность.

Для Timeline:

```text
/?react=1#/timeline?person=nova-byte
```

должен первоначально показать только события Nova.

### Что я делаю

1. В `TimelinePage` использую `useSearchParams()`.
2. Читаю `person`.
3. Проверяю, существует ли такой person id.
4. Для валидного id выбираю events, где `event.personIds.includes(personId)`.
5. Передаю выбранный person как `defaultValue` визуального select.
6. Если query отсутствует, показываю все события.
7. Если query неверный, показываю понятное предупреждение и безопасный fallback.
8. Не добавляю `useState`, `onChange` и controlled select.

`TimelineFilters` визуально содержит все ожидаемые controls: порядок, person, location и event type.
Только `person` из URL влияет на начальный список; изменение dropdown пользователем пока ничего не
пересчитывает, и я умею объяснить, что это граница задания 4.

На текущих данных:

```text
Timeline всего: 15 событий
nova-byte: T04, T05 и T14
```

### Почему это не настоящий интерактивный фильтр

URL является входными данными страницы. Я вычисляю список из текущего URL, но не создаю собственного
изменяемого state фильтра и не обновляю его через `onChange`.

Настоящий фильтр по изменению dropdown потребует:

- state или reducer;
- `onChange` handlers;
- controlled values;
- пересчёт списка после действий пользователя;
- возможно, синхронизацию state обратно в URL.

Это задача 5.

### Финальный аудит трёх React views

Проверяю Dashboard, People/Locations и Timeline:

- всё отображается через JSX;
- данные приходят через loader и props;
- нет импортов старых DOM render-функций;
- нет `innerHTML` и ручного создания DOM;
- списки имеют stable ids;
- routes можно сохранить в bookmarks;
- reload и Back/Forward работают;
- Evidence/Workspace остались вне scope.

### Что сказать про оставшееся дублирование

Нахожу один настоящий повтор, который пока не стал shared component. Например, похожие списки People
и Locations не обязательно объединять в абстрактный `EntityList`: данные и разметка разные, а пользы
от общей абстракции пока мало.

Главная мысль: не каждое сходство требует немедленной абстракции.

### Я понял Demo 10, если могу объяснить

- Почему query можно читать без нового feature state?
- Что понадобится для работающих dropdown filters?
- Почему route param и query param решают разные задачи?
- Какое дублирование я сознательно оставил и почему?

### Можно считать Demo 10 готовой, если

- [ ] `?person=` определяет начальный список Timeline.
- [ ] Nova показывает T04, T05 и T14.
- [ ] Неверный query не вызывает crash.
- [ ] Dropdowns видимы, но не содержат преждевременной интерактивности.
- [ ] Три нужные views полностью React.
- [ ] Я могу ответить на три вопроса задания.

---

## Как должны выглядеть папки после Demo 6

Это ориентир, а не список файлов, которые надо создавать пустыми:

```text
src/react/
├─ main.tsx
├─ app/
│  ├─ App.tsx
│  ├─ routes.tsx
│  └─ layout/
├─ features/
│  ├─ dashboard/
│  ├─ people-locations/
│  └─ timeline/
└─ shared/
   └─ components/

src/shared/
├─ data/
└─ utils/
```

Если отдельный файл не делает ответственность понятнее, не создаю его только ради красивого дерева.

## Важные технические ловушки

### Не импортировать legacy modules в React

Старые `dashboard.ts`, `people.ts` и `timeline.ts` используют `innerHTML`, `classList` и manual DOM.
Они остаются только для vanilla-режима.

### Не использовать старый класс .view

В старом CSS `.view` скрыт, пока imperative code не добавит `.active`. Router сам монтирует нужную
страницу, поэтому React route page не должна зависеть от старого `.active`.

### Проверить пути к данным и картинкам

На GitHub Pages приложение работает не из `/`, а из `/mystery-road-awe-2026/`. Для JSON учитываю
`import.meta.env.BASE_URL`, а logo/avatar проверяю в production preview через Network.

### Не делать value без onChange

Если `<select value={...}>` не имеет `onChange`, React считает control read-only и может показать
warning. Для начального визуального значения в этом задании использую `defaultValue`.

### Не искать запрещённые слова по всему проекту

Legacy-версия законно содержит `innerHTML`. Проверяю именно новый React-код, а не делаю вывод по
всему `src`.

## Мои заметки, чтобы не забыть объяснения

Мне удобно сохранить по одному короткому файлу на Demo. Это не научные отчёты: в них я фиксирую
ссылку на свой код, проверку и ответ своими словами. Так во время подготовки не приходится снова
искать каждый пример.

```text
docs/exercise4/
├─ ARCHITECTURE.md
├─ demo1.md
├─ demo2.md
├─ demo3.md
├─ demo4.md
├─ demo5.md
├─ demo6.md
├─ demo7.md
├─ demo8.md
├─ demo9.md
├─ demo10.md
└─ pictures/          # только если картинка действительно помогает live-показу
```

Для каждого `demoN.md` использую простой шаблон:

```text
# Demo N

## Что я изучал
## Что я сделал
## Где находится код
## Что показать live
## Ответы на вопросы своими словами
## Как я проверил результат
```

## Команды после каждого законченного шага

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Дополнительно проверяю React-код:

```bash
rg -n "innerHTML|dangerouslySetInnerHTML|createElement|appendChild|classList" src/react
rg -n "key=\{index\}|key=\{i\}|key=\{idx\}" src/react
rg -n "\bany\b" src/react
```

Первый поиск не должен находить manual DOM в компонентах. Учебный fixed example `key={index}` может
остаться только в документации или Git history, но не в финальном product code.

## URL, которые я обязан проверить

```text
/
/?react=1#/dashboard
/?react=1#/evidence
/?react=1#/team/people
/?react=1#/team/locations
/?react=1#/team/people/nova-byte
/?react=1#/team/people/not-real
/?react=1#/timeline
/?react=1#/timeline?person=nova-byte
/?react=1#/timeline?person=not-real
/?react=1#/workspace
/?react=1#/unknown
```

Для каждого важного route проверяю:

- переход кликом;
- active navigation;
- direct paste URL;
- reload;
- Back/Forward;
- Console;
- Network.

## Контрольные точки Git

Git здесь нужен мне как страховка и как история обучения. Я делаю commit не после каждого абзаца,
а после законченного и проверенного куска работы:

1. Demos 1–3: typed-компоненты, условия и списки работают.
2. Demos 5–7: понятны границы компонентов, папки приведены в порядок, общий UI переиспользуется.
3. Demo 8: Router установлен, routes работают после переходов и reload.
4. Demo 4: после появления Router я отдельным временным commit воспроизвожу ошибку с `key={index}`,
   затем следующим commit возвращаю stable id. Итоговая версия остаётся исправной.
5. Demos 9–10: работают detail route, URL-параметр и начальная фильтрация из query string.
6. Последний commit: заполнены мои заметки и пройдена финальная самопроверка.

Перед каждым commit я смотрю `git diff`. Push делаю только после локальной проверки всего этапа.

## Финальная самопроверка задания 4

### Код

- [ ] Dashboard, People/Locations и Timeline полностью React.
- [ ] Evidence и Workspace остались placeholders.
- [ ] Нет manual DOM в React-компонентах.
- [ ] Нет `any` в props.
- [ ] Нет product `key={index}`.
- [ ] Нет Timeline feature state и работающих `onChange` раньше задания 5.
- [ ] Vanilla-версия не сломана.

### Demo 1–4

- [ ] Есть три typed components и компонент с `children`.
- [ ] Я показал реальную TypeScript props error.
- [ ] Есть два conditional cases и две техники.
- [ ] People, Locations и Timeline рендерятся через `.map()`.
- [ ] Все реальные списки используют stable ids.
- [ ] Я воспроизвёл и исправил проблему `key={index}`.

### Demo 5–7

- [ ] Все компоненты классифицированы.
- [ ] Один перегруженный компонент разделён.
- [ ] Файлы организованы by feature.
- [ ] `ARCHITECTURE.md` соответствует реальному коду.
- [ ] Один shared component используется минимум в двух местах.
- [ ] Я могу сравнить reusable component со старыми template strings.

### Demo 8–10

- [ ] React Router установлен.
- [ ] People и Locations имеют отдельные routes.
- [ ] Unknown route обработан.
- [ ] Есть `/team/people/:personId` и ссылка на него.
- [ ] Unknown person id обработан.
- [ ] Timeline читает `?person=` для initial render.
- [ ] Я понимаю разницу route param и query param.

### Проверка знаний

- [ ] Я могу объяснить каждую Demo без чтения готового текста.
- [ ] Для каждого вопроса знаю конкретный пример из своего кода.
- [ ] Я провёл live-репетицию всех десяти Demo.
- [ ] Все четыре npm-команды проходят.
- [ ] Все URL проверены.
- [ ] Console чиста.
- [ ] Только теперь можно отмечать checkbox в исходном задании.
