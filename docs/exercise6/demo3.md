# Demo 6.3 — Cleanup для subscription

## Что изменено

- `EvidenceDetail` регистрирует `window` listener для клавиши Escape внутри `useEffect`.
- Escape закрывает текущую detail view через существующий `onClose` callback.
- Cleanup удаляет тот же listener при unmount или повторном запуске effect.
- `handleCloseEvidence` стабилизирован через `useCallback`.
- Setup, Escape и cleanup видны через `debugLog("6.3", ...)`.

## Почему cleanup необходим

Без cleanup после каждого открытия Evidence Detail оставался бы ещё один `window` listener. После
нескольких открытий одно нажатие Escape вызвало бы несколько старых handlers, повторные URL updates
и callbacks со старыми search params.

Это наблюдаемая ошибка, а не только абстрактная «утечка памяти».

## Когда React вызывает cleanup

1. Перед следующим запуском effect, если dependency изменилась.
2. При unmount компонента.
3. Дополнительно в development `StrictMode`, где React проверяет последовательность
   setup → cleanup → setup.

React вызывает cleanup-функцию, а внутри неё приложение удаляет listener. Удалять нужно тот же
`handleKeyDown` reference, который был передан в `addEventListener`.

## Dependencies

Effect использует `evidence.id` для logs и `onClose` для закрытия, поэтому оба значения находятся в
dependency array. `handleCloseEvidence` обёрнут в `useCallback`, чтобы unrelated parent render не
создавал новый callback и не перезапускал subscription без необходимости.

## Как показать Demo

1. Открыть Evidence Detail и увидеть setup log.
2. В development учесть ожидаемую проверку `StrictMode`.
3. Нажать Escape: detail закрывается, затем появляется cleanup log.
4. Несколько раз открыть разные Evidence и убедиться, что один Escape вызывает один close log.
5. Для сравнения временно убрать `return` с cleanup, повторить открытия и увидеть несколько старых
   handlers; после демонстрации обязательно вернуть cleanup.

