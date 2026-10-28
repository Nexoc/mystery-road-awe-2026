# Git-команды для переключения заданий и Demo

Этот файл нужен для live demo. Команды позволяют открыть итоговое состояние задания или конкретный
коммит Exercise 4.

## Перед переключением

Сначала проверь рабочее дерево:

```bash
git status --short
```

Если есть незакоммиченные или новые файлы, временно сохрани их вместе с untracked-файлами:

```bash
git stash push -u -m "before exercise switch"
```

После возврата на свою ветку изменения можно восстановить:

```bash
git switch exercise-4
git stash pop
```

`git stash pop` нужно выполнять только в том случае, если перед показом был создан stash.

## Переключение между готовыми заданиями

| Состояние       | Команда                       | Итоговый коммит |
| --------------- | ----------------------------- | --------------- |
| Исходный проект | `git switch main`             | `22cb2d8`       |
| Exercise 1      | `git switch exercise-1`       | `4c19006`       |
| Exercise 2      | `git switch --detach 93adffc` | `93adffc`       |
| Exercise 3      | `git switch exercise-3`       | `53728a1`       |
| Exercise 4      | `git switch exercise-4`       | `7d4e7ae`       |

Локальная ветка `exercise-2` содержит уже начало следующего задания. Поэтому для точного финального
состояния Exercise 2 используется коммит `93adffc` в режиме detached HEAD.

## Exercise 4: переключение по Demo

| Demo          | Что изменено                   | Команда для результата        |
| ------------- | ------------------------------ | ----------------------------- |
| До Exercise 4 | Финальное состояние Exercise 3 | `git switch --detach 53728a1` |
| Demo 1        | Typed components и props       | `git switch --detach ed33d19` |
| Demo 2        | Conditional rendering          | `git switch --detach 9338521` |
| Demo 3        | Collections и стабильные keys  | `git switch --detach e38671c` |
| Demo 4        | Показ ошибки `key={index}`     | `git switch --detach a843704` |
| Demo 5        | Разделение компонентов         | `git switch --detach a8fd6f0` |
| Demo 6        | Структура по features          | `git switch --detach 4329273` |
| Demo 7        | Общий компонент `Badge`        | `git switch --detach 6b33a5f` |
| Demo 8        | React Router                   | `git switch --detach f60313e` |
| Demo 9        | Route parameter                | `git switch --detach a0968bb` |
| Demo 10       | Query parameter Timeline       | `git switch --detach 7d4e7ae` |

Коммит Demo 4 был создан позже коммитов Demo 5–8. Поэтому порядок хэшей в истории отличается от
порядка заданий. Для показа только изменений Demo 4 лучше использовать `git diff`.

## Пример: показать Demo 1 до и после

Состояние перед изменением:

```bash
git switch --detach ed33d19^
```

Состояние после изменения:

```bash
git switch --detach ed33d19
```

Посмотреть только разницу без переключения:

```bash
git diff ed33d19^ ed33d19
```

## Та же схема для любой Demo

```bash
# До выбранного коммита
git switch --detach <COMMIT_HASH>^

# После выбранного коммита
git switch --detach <COMMIT_HASH>

# Только изменения выбранного коммита
git diff <COMMIT_HASH>^ <COMMIT_HASH>
```

Например, для Demo 10:

```bash
git switch --detach 7d4e7ae^
git switch --detach 7d4e7ae
git diff 7d4e7ae^ 7d4e7ae
```

## Вернуться после показа

Вернуться на рабочую ветку Exercise 4:

```bash
git switch exercise-4
```

Вернуться на предыдущую ветку или предыдущий checkout:

```bash
git switch -
```

Проверить текущее положение:

```bash
git status --short --branch
git log -1 --oneline --decorate
```

В режиме detached HEAD старые состояния лучше только просматривать. Не создавай там новые коммиты;
после демонстрации вернись командой `git switch exercise-4`.

Подробные коммиты Demo 1–10 первого задания уже перечислены в
`docs/exercise1/live_demo_git_commands.md`.
