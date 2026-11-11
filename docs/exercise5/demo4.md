# Demo 4 — derived values вместо лишнего state

> Здесь описано состояние проекта на этапе Demo 4. Поздние Demo меняют доставку bookmark state, но
> derived count и lists сохраняются.

## Что изменено

- Search, type, person, location, status, relevance и sort хранятся как исходные параметры
  отображения.
- `visibleEvidence` не хранится в state. Он вычисляется функцией `getVisibleEvidence` из полного
  массива Evidence и текущих filters при каждом render.
- Перед сортировкой создаётся новый массив: `const sortedEvidence = [...filteredEvidence]`.
- Выбранный Evidence ID читается из URL `?item=...`, а объект ищется в полном актуальном массиве.
- Dashboard не хранит bookmark count, а вычисляет `bookmarkIds.length`.
- Workspace не хранит отдельный bookmarked list, а фильтрует Evidence по актуальным bookmark IDs.
- `useMemo` не добавлен: набор данных небольшой, а обычное вычисление остаётся понятным.

## Что должно храниться в state

В state хранится факт, который нельзя однозначно вычислить из других текущих props/state и который
должен пережить следующий render как результат действия пользователя.

Например, выбранные значения filters являются state: их задал пользователь. `visibleEvidence` не
является отдельным фактом — при одинаковых Evidence и filters результат всегда один и тот же, поэтому
он вычисляется.

## Почему две старые ошибки теперь невозможны по структуре

### Устаревший bookmark count

Отдельного count и setter для него больше нет. Dashboard получает живой массив bookmark IDs и на
каждом render вычисляет `bookmarkIds.length`. Нельзя обновить bookmarks и забыть отдельно обновить
count, потому что второго значения не существует.

### Мутация master Evidence при сортировке

Отдельного `filteredEvidence` state тоже нет. `filter()` создаёт новый массив, затем перед `.sort()`
создаётся ещё одна явная копия. Исходный `evidence` не сортируется и сохраняет свой порядок.

## Как показать Demo

1. Использовать search и каждый select-фильтр.
2. Показать четыре варианта sort.
3. Нажать `Clear filters` и получить исходные значения controls.
4. В React DevTools показать только filter state и отсутствие `visibleEvidence` state.
5. В коде показать полный pipeline `evidence → filter → copy → sort`.
6. Открыть Detail и показать, что выбранный ID находится в URL, а не в отдельном state.
