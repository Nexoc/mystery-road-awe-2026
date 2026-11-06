# Demo 2 — `useState` и controlled forms

## Что изменено

- Search в Evidence стал controlled input: значение хранится в `searchTerm`, передаётся через
  `value`, а `onChange` вызывает `setSearchTerm`.
- Список Evidence сразу вычисляется из исходного массива и поисковой строки.
- Все поля Hypothesis form хранятся в одном объекте `HypothesisDraft`.
- `select multiple` сохраняет массив Evidence IDs.
- Значение range преобразуется из строки браузера в число.
- Submit не перезагружает страницу и записывает draft в `localStorage`.
- При первом render draft безопасно читается из `localStorage` через lazy initializer, без
  `useEffect`.
- Сообщения `Saved` и ошибки выводятся через React-state, без `classList`.

## Controlled и uncontrolled input

Controlled input получает текущее значение из React-state:

```tsx
<input
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.currentTarget.value)}
/>
```

У uncontrolled input значение хранит сам DOM. Обычно начальное значение задаётся через
`defaultValue`, а React не обновляет его на каждом render.

Если у controlled input оставить `value`, но удалить `onChange`, пользователь сможет нажимать
клавиши, однако отображаемый текст не изменится. Браузер временно сообщает новое значение, но React
снова отображает значение из state. Поскольку setter не вызывался, state остаётся прежним.

## Почему форма хранится одним объектом

Используется один `useState<HypothesisDraft>`, потому что все шесть полей образуют один черновик и
сохраняются вместе. Изменение одного поля создаёт новый объект через spread:

```tsx
setDraft((currentDraft) => ({
  ...currentDraft,
  explanation: nextExplanation,
}));
```

Отдельный `useState` для каждого поля тоже работал бы, но усложнил бы загрузку, сохранение и reset
всего draft. `useReducer` здесь пока не нужен: переходы простые и в основном заменяют одно поле. В
Demo 7 reducer будет полезнее для search/filter/sort state, где есть много связанных значений и
общая команда `CLEAR_FILTERS`.

## Как показать Demo

1. Ввести текст в Evidence search и показать изменение списка.
2. Заполнить оба select, выбрать несколько Evidence через `Ctrl`/`Cmd`, изменить range и оба
   textarea.
3. Нажать `Save hypothesis draft` и показать сообщение `Saved`.
4. Перезагрузить страницу Workspace и показать восстановленные значения.
5. В коде показать `value`, `onChange`, `onSubmit`, lazy initializer и отсутствие `useEffect` и
   `document.getElementById`.
