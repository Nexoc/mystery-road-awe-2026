# Demo 6.5 — React загружает данные с backend

## Что изменено

- Удалён top-level `await loadInvestigationData()` из `main.tsx`.
- React теперь монтируется сразу.
- Новый `InvestigationApp` запускает загрузку внутри `useEffect`.
- Все пять ресурсов загружаются с `/api/...`, а не напрямую из `data/*.json`.
- Минимальные loading и error состояния находятся в React state.
- Существующий `App` монтируется только после получения полного `InvestigationData`.

## Порядок событий

```text
InvestigationApp mount
→ первый render: data === null
→ React commit
→ useEffect вызывает loadInvestigationData()
→ Promise.all запускает пять fetch
→ backend возвращает JSON
→ response.ok и runtime validators проверяют ответы
→ setData(nextData)
→ React планирует новый render
→ InvestigationApp рендерит App
→ routes получают готовые данные
```

Effect callback не объявлен `async`: React ожидает от него `undefined` или cleanup, а не Promise.
Асинхронная работа запускается внутри effect через Promise chain.

## Новое состояние

Раньше React получал только готовый `data` object. Теперь loader-компонент должен различать:

- запрос выполняется: `data === null` и ошибки нет;
- запрос успешен: `data` содержит `InvestigationData`;
- запрос завершился ошибкой: `loadError` содержит сообщение.

Полный дизайн loading/error/empty states относится к Demo 6.6. Здесь используется только минимальный
bootstrap UI.

## Источники данных

```text
case      → /api/case
evidence  → /api/evidence
people    → /api/people
locations → /api/locations
timeline  → /api/timeline
```

Bookmarks читаются из `localStorage` после загрузки Evidence и очищаются от неизвестных IDs. Notes и
Hypothesis также остаются в `localStorage`.

## StrictMode

В development `StrictMode` может запустить mount effect дважды и показать два набора GET requests.
Backend read-only, поэтому это безопасно. Cleanup с `AbortController` и защита от stale responses
намеренно остаются для Demo 6.7.

## Как показать Demo

1. Запустить `npm run dev:server` и `npm run dev` в разных терминалах.
2. Открыть `/?react=1#/evidence`.
3. В Network показать `/api/case`, `/api/evidence`, `/api/people`, `/api/locations` и
   `/api/timeline`.
4. Пройти все пять views и проверить прежние данные.
5. Перезагрузить страницу и проверить bookmarks, notes и hypothesis.
6. Остановить backend и перезагрузить страницу: появляется минимальный error state.
7. В Console проследить logs с marker `6.5` от effect до state update.

