# План рефакторинга

Берём текущий `app.js` и раскладываем его в `features + MVC`.
Ничего не улучшаем и не чиним — поведение и старые баги сохраняем.

**Правило:** каждый шаг ниже делаем и коммитим отдельно. К следующему шагу
переходим только после commit.

## 1. Создать структуру

```text
src/
├── main.js
├── app/          # state, router, appView, bootstrap
├── features/     # dashboard, evidence, people, timeline, workspace
│   └── feature/  # model, view, controller
└── shared/       # storage, utils
```

## 2. Вынести общий код

- переменные → `app/state.js`;
- навигацию → `app/router.js`;
- переключение экранов/loading → `app/appView.js`;
- localStorage → `shared/storage.js`;
- общие helpers → `shared/utils.js`.

## 3. Разнести features

Для каждого экрана:

- Model — данные, фильтры и сортировка;
- View — HTML и DOM;
- Controller — события и связь Model с View.

## 4. Всё соединить

`app/bootstrap.js` создаёт controllers и передаёт callbacks между features.
Features напрямую друг друга не импортируют.

## 5. Подключить ES Modules

`main.js` запускает Bootstrap, а в `index.html` ставим:

```html
<script type="module" src="src/main.js"></script>
```

Для старых inline handlers временно оставляем нужные функции в `window.*`.

## 6. Закончить

Удалить старый `app.js`, проверить все страницы и Console.
Экспортировать только то, что реально используется в другом файле.
