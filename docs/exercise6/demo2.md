# Demo 6.2 — `useEffect` и dependency arrays

## Что изменено

- Добавлена presentation-страница `/effects-demo`.
- На ней находятся три effects: без dependency array, с `[]` и с `[count]`.
- Добавлены два независимых state updates, чтобы сравнить tracked и unrelated render.
- `DocumentTitleSync` синхронизирует `document.title` с текущим route.

## Три варианта effect

```text
useEffect(fn)          → после каждого committed render
useEffect(fn, [])      → после mount
useEffect(fn, [count]) → после mount и изменения count
```

В development `StrictMode` initial effects могут выполняться повторно. Это проверка React, а не
ошибка dependency array.

## Что сравнивает React

React сравнивает каждую dependency с предыдущим значением через `Object.is`. Если effect использует
reactive value, но оно отсутствует в dependencies, closure может сохранить старое значение и effect
не запустится после нужного изменения.

## Почему `useEffect(fn, [])` не равен `fn()` в render

- Effect запускается после commit.
- Функция в теле компонента выполняется во время render.
- Render может повториться или быть отменён.
- Effect в следующих Demo сможет вернуть cleanup.

## Реальное применение

`DocumentTitleSync` читает текущий route через `useLocation`. Название страницы вычисляется чисто во
время render, а запись в browser API `document.title` выполняется в effect с dependency
`[pageTitle]`.

## Как показать Demo

1. Открыть `/?react=1#/effects-demo` и Console.
2. Учесть initial logs `StrictMode`.
3. Нажать `Trigger unrelated render`: effect без массива запускается, `[count]` — нет.
4. Нажать `Increment tracked count`: запускаются effect без массива и effect `[count]`.
5. Перейти между основными routes и показать изменение title вкладки.

