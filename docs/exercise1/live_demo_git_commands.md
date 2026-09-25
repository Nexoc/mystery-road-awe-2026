# Git-команды для live demo

Перед переключением проверь `git status`: рабочее дерево должно быть чистым.

## Ветки

| Команда | Что показываем |
|---|---|
| `git switch main` | Исходный шаблон проекта без рефакторинга |
| `git switch exercise-1` | Основная работа: Demo 1–10 |
| `git switch mvc-refactor` | Альтернатива: Feature-Based структура + MVC |
| `git switch -` | Вернуться на предыдущую ветку |

## Коммиты `exercise-1`

| Команда | Что находится в этом состоянии |
|---|---|
| `git switch --detach 22cb2d8` | Исходный AWE-шаблон |
| `git switch --detach c486c2d` | Подготовлена структура ES Modules |
| `git switch --detach f88925d` | Demo 1 — приложение разделено на ES Modules |
| `git switch --detach f3b207e` | Demo 2 — исправлена мутация массива при сортировке Evidence |
| `git switch --detach d871371` | Demo 3 — исправлено зависание загрузки Evidence после ошибки `fetch` |
| `git switch --detach 3d17b6a` | Demo 4 — исправлена скрытая ошибка listener навигации |
| `git switch --detach 0a971f5` | Demo 5 — исправлены ошибки полного walkthrough |
| `git switch --detach bf3fb15` | Demo 6 — документирован JavaScript Debugger |
| `git switch --detach 6db8fec` | Demo 7 — документирован DevTools Tour |
| `git switch --detach 1c419ab` | Demo 8 и 9 — Clean Code и `async`/`await` |
| `git switch --detach 4cfb9dc` | Demo 10 — Arrow Functions |

## Коммиты `mvc-refactor`

| Команда | Что находится в этом состоянии |
|---|---|
| `git switch --detach 10d9bbb` | Короткий план MVC-рефакторинга |
| `git switch --detach cf6d183` | Каркас Feature-Based + MVC |
| `git switch --detach 23cd648` | Общая инфраструктура приложения вынесена отдельно |
| `git switch --detach 9492891` | Views разделены на MVC-модули по features |
| `git switch --detach a6c3ba0` | Подключены feature controllers |
| `git switch --detach 5975987` | `index.html` переключён на новый ES-module entry point |

## Показать before/after одного коммита

```bash
# Состояние прямо перед выбранным коммитом
git switch --detach <COMMIT_HASH>^

# Состояние после выбранного коммита
git switch --detach <COMMIT_HASH>

# Только разница без переключения
git diff <COMMIT_HASH>^ <COMMIT_HASH>
```

Пример для Demo 10:

```bash
git switch --detach 4cfb9dc^
git switch --detach 4cfb9dc
git diff 4cfb9dc^ 4cfb9dc
```

## Вернуться после показа

```bash
git switch exercise-1
```

В режиме `detached HEAD` ничего не коммитить — он нужен только для просмотра старого состояния.

Полная история без встроенного pager:

```bash
git --no-pager log --oneline --all --decorate --graph
```
