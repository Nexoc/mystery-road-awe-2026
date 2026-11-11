# Demo 7 — `useReducer` для Evidence filters

## Что изменено

Семь связанных значений Evidence toolbar теперь управляются одним `useReducer`:

- search term;
- type;
- person;
- location;
- status;
- relevance;
- sort order.

Reducer находится в `evidenceFilters.ts` и поддерживает три явных действия:

```ts
{ type: "SET_FILTER", name, value }
{ type: "SET_SORT", sortOrder }
{ type: "CLEAR_FILTERS" }
```

Список `visibleEvidence` не входит в reducer state. Он по-прежнему вычисляется из полного Evidence
массива и текущих filters во время render.

## Почему здесь reducer лучше нескольких `useState`

Все значения принадлежат одному toolbar domain, участвуют в одном вычислении и должны очищаться
вместе. Reducer хранит правила переходов в одном месте, а handlers только сообщают намерение через
`dispatch`.

Отдельные `useState` тоже могли бы работать, но общий reset потребовал бы нескольких setter-вызовов.
При добавлении нового filter легко было бы забыть включить его в очистку.

## `CLEAR_FILTERS`

```ts
case "CLEAR_FILTERS":
  return initialEvidenceFilters;
```

Одно действие возвращает полный согласованный state, включая начальный sort order. Reducer остаётся
чистой функцией: он не читает DOM, storage или текущее время.

## Связь `useReducer` и `useState`

Оба hook работают по одной реактивной модели: действие планирует следующее состояние, затем React
делает новый render. `useState` удобен для простого независимого значения. `useReducer` добавляет
явные actions и одну функцию переходов для сложного связанного domain. Концептуально `useState`
можно считать более простым интерфейсом той же идеи, хотя это не утверждение о внутренней реализации
React.

## Как показать Demo

1. Изменить search, два filter и sort.
2. В React DevTools показать один reducer state object.
3. Нажать `Clear filters` и показать один `CLEAR_FILTERS` dispatch.
4. Показать, что reducer state не содержит готовый список Evidence.
