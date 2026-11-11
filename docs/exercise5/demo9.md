# Demo 9 — аудит типичных state-проблем

## Исправленные реальные проблемы

| Проблема | Категория | Как обнаружена | Исправление |
| --- | --- | --- | --- |
| После toggle Dashboard и Workspace продолжали читать начальные bookmark IDs | Stale state | Ручной сценарий Evidence → Dashboard → Workspace и code review | В commit `dee7a94` bookmark state поднят в `App`; count и list вычисляются из актуального массива |
| EvidencePage имел изменяемую локальную версию bookmark IDs, а другие routes использовали `data.bookmarkIds` | Duplicated state | Сравнение владельцев одного факта в React DevTools и коде до `dee7a94` | Оставлен один изменяемый source of truth в `App`; отдельные copies удалены |
| Bookmark value и callback проходили через компоненты, которым они не нужны | Prop drilling | Прослеживание цепочки Demo 6 в commit `e424934` | В Demo 8 добавлен узкий Context; `AppRoutes` и feature pages больше не пересылают bookmark props |

## Почему первые две проблемы различаются

Duplicated state описывает причину: один bookmark-факт существовал в нескольких расходящихся
версиях. Stale state описывает наблюдаемый результат: Dashboard и Workspace показывали старую
версию после изменения в Evidence.

## Итоговый аудит пяти категорий

- Duplicated state: bookmark count, bookmarked list и visible Evidence являются derived values.
- Stale state: все bookmark consumers читают одно актуальное context value.
- Prop drilling: bookmarks переведены на Context; notes оставлены явными props, потому что их путь
  короткий и понятный.
- Unnecessary global state: filters и hypothesis draft остаются локальными.
- Mutation: bookmark toggle возвращает новый массив; notes и draft используют spread; Evidence
  сортируется только после создания копии.

## Связь с Exercise 1

История приложения сильнее всего показывает сочетание duplicated и stale state. Vanilla-версия
хранила связанные факты в нескольких местах и обновляла разные части UI отдельными командами.
React-версия оставляет один source of truth и вычисляет представление во время render, поэтому нельзя
обновить bookmarks и забыть отдельно обновить Dashboard count.

## Как показать Demo

1. Открыть состояние до `dee7a94` и показать локальные/начальные bookmark IDs.
2. В текущем коде показать единственный bookmark `useState` в `App`.
3. Выполнить toggle и пройти Evidence → Dashboard → Workspace без reload.
4. Показать Context как отдельное исправление prop drilling.
