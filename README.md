# NBD Homepage — главная страница «Наш Белый Дом»

**Технологии, архитектура проекта и инструкция по интеграции с MODX Revolution**

Проект представляет собой новую главную страницу сайта **«Наш Белый Дом» (NBD)**. Главная страница состоит из четырёх анимированных экранов и реализована на чистом JavaScript без React, Vue или jQuery. Готовую сборку можно подключить к действующему сайту на **MODX Revolution**.

> **Принцип развёртывания:** разработка и сборка выполняются локально с помощью Vite. В рабочей среде MODX формирует HTML через шаблон (Template) и чанки (Chunks), а веб-сервер отдаёт готовые CSS, JavaScript и изображения. **Node.js на продакшен-сервере MODX не требуется.**

## 1. Используемые технологии

| Технология | Назначение |
| --- | --- |
| **Vanilla JavaScript (ES Modules)** | Работа интерфейса и инициализация компонентов без frontend-фреймворков. |
| **Vite 7** | Локальный сервер разработки, сборка JS и CSS, обработка путей к изображениям, хеширование файлов в production. |
| **Tailwind CSS 4** и `@tailwindcss/vite` | Стилизация интерфейса, переменные темы, переиспользуемые CSS-классы через `@apply`. |
| **Современный CSS** | Анимации, трансформации, затемнение фонов, пламя ракеты, адаптивная вёрстка. |
| **IntersectionObserver** | Отслеживание появления секций в области просмотра и запуск анимаций текста, изменение фона шапки. |
| **requestAnimationFrame** | Плавная обратная прокрутка экранов, движение ракеты, эффект печати и реакция на скролл. |
| **WebP / SVG** | Фоны экранов, изображение ракеты и графика услуг. |
| **MODX Revolution 2.x / 3.x** | CMS рабочего сайта: шаблоны, чанки, ресурсы, поля и при необходимости обработка форм через FormIt. |

**Требования:** для запуска готового сайта достаточно современного браузера. Для локальной сборки Vite 7 нужен **Node.js 20.19+ или 22.12+**; рекомендуется актуальная версия Node.js 22.

## 2. Функциональность главной страницы

- **Четыре полноэкранных экрана** с согласованными фоновыми изображениями WebP: запуск, разработка сайта, продвижение и маркетинговая воронка.
- **Обратная прокрутка на десктопе:** экраны расположены один над другим и при прокрутке перемещаются вниз внутри закреплённой области.
- **Анимированная ракета:** запуск двигателя при загрузке, постоянное пламя, небольшой подъём и наклон влево при наведении, усиление пламени при прокрутке и ускоренный вылет на последнем экране.
- **Эффект печати текста:** последовательное появление текста первого экрана при загрузке и однократные анимации последующих экранов при прокрутке.
- **Последовательное появление карточек услуг**, красные плашки заголовков и затемнение фоновых изображений для контраста с белым текстом.
- **Адаптивность:** на экранах уже 1024 px используется обычная вертикальная прокрутка; десктопная обратная прокрутка и ракета отключаются.
- **Поддержка `prefers-reduced-motion`:** уменьшение числа анимаций для пользователей с соответствующей системной настройкой.
- **Выдвижное меню** с подменю услуг, управлением клавиатурой и закрытием по Escape.
- **Контактный блок**, баннер согласия на cookies и бегущая строка логотипов платёжных систем.
- **Изменение шапки:** тёмно-синий фон и тень появляются, только когда секция `#contact` находится в видимой области браузера.

### Ограничения текущей реализации

1. **Форма обратной связи демонстрационная.** Сейчас JavaScript отменяет стандартную отправку и показывает уведомление. Форма **не отправляет** обращения на почту, в MODX или CRM. Для продакшена понадобится серверная обработка.
2. **Выбор cookies сохраняется в `localStorage`, но сам по себе не управляет сторонними скриптами аналитики и рекламы.** Перед запуском следует связать сохранённый выбор с фактической загрузкой этих скриптов.
3. Часть логотипов, иконок, favicon и изображений платёжных систем загружается по адресам `https://nbd.by/`. При необходимости их можно перенести в локальные assets проекта или библиотеку файлов MODX.
4. Перед публикацией нужно проверить контакты, юридическую информацию, ссылки на услуги и политики сайта.

## 3. Структура проекта

```text
nbd-homepage/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── src/
    ├── main.js
    ├── style.css
    ├── assets/
    │   └── images/
    │       ├── rocket-original.webp
    │       ├── slide_1.webp
    │       ├── slaid_2.webp
    │       ├── slaid_6.webp
    │       └── slaid_4.webp
    └── components/
        ├── index.js
        ├── utils.js
        ├── menu.js
        ├── header.js
        ├── rocket.js
        ├── scenes.js
        ├── typing.js
        ├── heroTyping.js
        ├── scrollTyping.js
        ├── payments.js
        ├── contactForm.js
        └── cookies.js
```

Файл `src/components/index.js` экспортирует функции инициализации остальных модулей. Благодаря этому `main.js` остаётся компактным, а импорты из директории `./components` обрабатываются Vite:

```javascript
import './style.css';

import {
  menu,
  header,
  rocket,
  scenes,
  heroTyping,
  scrollTyping,
  payments,
  contactForm,
  cookies,
} from './components';

const initScripts = {
  init: function () {
    menu();
    header();

    const rocketInstance = rocket();

    scenes(rocketInstance);
    heroTyping();
    scrollTyping();
    payments();
    contactForm();
    cookies();
  },
};

initScripts.init();
```

### Назначение компонентов

| Файл | Ответственность |
| --- | --- |
| `menu.js` | Открытие и закрытие меню, подменю, обработка фокуса и клавиатуры. |
| `header.js` | Отслеживание `#contact`, включение фона и тени шапки. |
| `rocket.js` | Загрузка изображения ракеты, траектория полёта, запуск двигателя и зависимость пламени от скролла. |
| `scenes.js` | Обратная прокрутка, навигация между экранами, однократное появление карточек. |
| `typing.js` | Универсальный механизм анимации печати текста. |
| `heroTyping.js` | Анимация текста первого экрана при загрузке страницы. |
| `scrollTyping.js` | Анимация текста остальных экранов при появлении в viewport. |
| `payments.js` | Формирование бегущей строки платёжных систем. |
| `contactForm.js` | Демонстрационная обработка отправки контактной формы. |
| `cookies.js` | Сохранение выбора пользователя по cookies. |
| `utils.js` | Общие утилиты, easing, задержки и media queries. |

### Обязательные HTML-селекторы

JavaScript обращается к DOM по идентификаторам и классам. При переносе в MODX **сохрани их без изменений**:

- `#reverse-scroll`, `#slides-track`, `.reverse-slide`, `#slide-1` … `#slide-4`;
- `#rocket-image`, `#rocket-animation`, `#rocket-exhaust`;
- `#site-header`, `#contact`;
- `#menu-panel`, `#menu-drawer`, `#menu-backdrop`, `#menu-open`, `#menu-close`, `#submenu-toggle`, `#services-submenu`;
- `.scene-heading`, `.scene-copy`, `.scene-subheading`, `.scene-description`, `.hero-accent`, `.service-card`;
- `.contact-heading`, `.contact-panel`, `.contact-intro`, `#demo-contact`, `#demo-form-notice`;
- `#payment-track`, `#cookie-panel`, `#cookie-all`, `#cookie-essential`.

Порядок экранов связан также с атрибутами `style="--slide-index: 0"` … `style="--slide-index: 3"`. При переносе секций в MODX Chunks эти значения необходимо сохранить.

## 4. Локальная разработка

Из корня проекта выполни:

```bash
npm ci
npm run dev
```

Открой `http://localhost:5173` либо адрес, который покажет Vite в терминале.

Дополнительные команды:

```bash
npm run build
npm run preview
npm run format
```

- `npm run build` создаёт каталог `dist/`.
- `npm run preview` запускает локальный просмотр production-сборки.
- `npm run format` форматирует код через Prettier, если такой скрипт определён в `package.json`.

Проект использует интеграцию Tailwind с Vite через `@tailwindcss/vite`. В начале `src/style.css` должны быть объявлены пути к исходным файлам:

```css
@import 'tailwindcss';

@source '../index.html';
@source './main.js';
@source './components';
```

> **Важно:** Tailwind генерирует CSS на основе **локальных исходников**, а не содержимого Chunks на удалённом сервере MODX. Если класс добавлен только в админке MODX, его может не оказаться в CSS после сборки. Синхронизируй разметку с локальным `index.html` или добавляй нужные классы через `@source inline()`.

---

# 5. Интеграция с действующим сайтом на MODX Revolution

## Общий подход

**MODX продолжает отвечать за HTML-разметку страницы.** Не нужно заменять `index.php` CMS файлом `index.html` из Vite или загружать на сервер исходную папку `src/`.

Порядок действий:

1. Собрать фронтенд с правильным публичным путём.
2. Загрузить содержимое `dist/` в отдельную директорию сайта.
3. Создать отдельный MODX Template для главной страницы и вынести её части в Chunks.
4. Подключить к Template **собранные** CSS и JavaScript.
5. Протестировать новую страницу и только после проверки назначить Template главному ресурсу.

В примерах ниже используется публичная директория:

```text
/assets/nbd-home/
```

Если на сервере другой путь к документам сайта, поменяй его **во всех местах** — и в сборке Vite, и в ссылках MODX.

## Шаг 1. Резервная копия и тестовая страница

Перед изменениями на рабочем сайте:

- Сохрани текущий Template главной страницы, связанные Chunks и Snippets, файлы CSS/JS и резервную копию базы данных.
- Выясни, какой Resource является главной страницей: в настройках MODX это значение `site_start`.
- Лучше использовать staging-домен или отдельный неопубликованный Resource для проверки нового Template.
- Проверь, не загружаются ли на старой главной странице Skrollr, jQuery-анимации и другие скрипты прокрутки. **Не запускай их одновременно с новым движком обратного скролла.**

## Шаг 2. Сборка Vite под путь MODX

Чтобы пути к JS, CSS и WebP корректно работали из вложенной директории, собери проект с параметром `base`:

```bash
npm ci
npm run build -- --base=/assets/nbd-home/
```

Либо закрепи этот путь в `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  base: '/assets/nbd-home/',
  server: {
    host: 'localhost',
    port: 5173,
  },
  build: {
    cssCodeSplit: false,
  },
});
```

Если `base` уже прописан в конфигурации, достаточно выполнить `npm run build`. Можно использовать любой из двух способов; главное, чтобы публичный путь был одинаковым.

Пример результата сборки:

```text
dist/
├── index.html
└── assets/
    ├── index-EXAMPLE.js
    ├── index-EXAMPLE.css
    ├── rocket-original-EXAMPLE.webp
    ├── slide_1-EXAMPLE.webp
    ├── slaid_2-EXAMPLE.webp
    ├── slaid_6-EXAMPLE.webp
    └── slaid_4-EXAMPLE.webp
```

Это **условные названия**. Vite может изменить имена, хеши и набор файлов. Реальные ссылки необходимо брать из своего `dist/index.html`.

## Шаг 3. Загрузка собранных файлов на сервер

Через SFTP, SSH или файловый менеджер хостинга загрузи **содержимое каталога `dist/`** в:

```text
public_html/
└── assets/
    └── nbd-home/
        ├── index.html
        └── assets/
            ├── index-<hash>.js
            ├── index-<hash>.css
            └── <изображения и остальные файлы сборки>
```

`dist/index.html` можно оставить в этой директории для проверки, но **саму главную страницу должен формировать MODX**, а не статический HTML-файл Vite. После извлечения ссылок на собранные ресурсы `index.html` можно не загружать, если он не нужен.

Проверь, что опубликованные ссылки открываются в браузере:

```text
https://nbd.by/assets/nbd-home/assets/index-<реальный-хеш>.js
https://nbd.by/assets/nbd-home/assets/index-<реальный-хеш>.css
```

Они должны возвращать содержимое CSS/JS, а не 404 или HTML-страницу ошибки. То же относится к WebP и другим ресурсам.

## Шаг 4. Создание Chunks в MODX

В админке **MODX Manager → Elements → Chunks** создай чанки с такими именами:

| Chunk | Что перенести из исходного `index.html` |
| --- | --- |
| `nbdHomeHeader` | Ссылку пропуска навигации и `<header id="site-header">…</header>`. |
| `nbdHomeMenu` | Полный блок `<nav id="menu-panel">…</nav>`. |
| `nbdHomeScenes` | Весь `<div id="reverse-scroll">…</div>`: четыре экрана и ракета. |
| `nbdHomeContact` | Блок `<section id="contact">…</section>`. |
| `nbdHomeFooter` | Полный `<footer>…</footer>`. |
| `nbdHomeCookies` | Баннер `<aside id="cookie-panel">…</aside>`. |

Копируй **всю вложенную HTML-разметку** соответствующих элементов. В Chunks не следует дублировать теги `<html>`, `<head>`, `<body>` и `<main>` — они останутся в Template.

### Важное изменение для изображения ракеты

В локальном `index.html` может быть указан путь:

```html
<img
  id="rocket-image"
  src="/src/assets/images/rocket-original.webp"
  alt=""
  class="rocket-image"
/>
```

Путь `/src/assets/...` относится к исходникам и **не должен попадать в продакшен-разметку MODX**. Собранный JS сам присваивает правильный URL с хешем через импорт Vite. Поэтому в Chunk используй:

```html
<img id="rocket-image" alt="" class="rocket-image" />
```

Идентификатор `rocket-image` при этом обязательно сохранить.

## Шаг 5. Создание отдельного Template

В админке **MODX Manager → Elements → Templates** создай новый шаблон, например **`NBD Home (Vite)`**.

Пример его содержимого — **замени имена JS/CSS на реальные из `dist/index.html`**:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="[[++site_url]]" />
    <title>[[*pagetitle]] — [[++site_name]]</title>
    <meta name="description" content="[[*description]]" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="/assets/nbd-home/assets/index-REPLACE_WITH_REAL_HASH.css"
    />
  </head>

  <body class="page-body">
    [[$nbdHomeHeader]]
    [[$nbdHomeMenu]]

    <main id="main">
      [[$nbdHomeScenes]]
      [[$nbdHomeContact]]
    </main>

    [[$nbdHomeFooter]]
    [[$nbdHomeCookies]]

    <script
      type="module"
      src="/assets/nbd-home/assets/index-REPLACE_WITH_REAL_HASH.js"
    ></script>
  </body>
</html>
```

**Не используй в MODX исходный скрипт Vite:**

```html
<script type="module" src="/src/main.js"></script>
```

Аналогично, нельзя подключать сырой `src/style.css` — только готовый CSS из `dist/`.

### Передача контента в поля MODX

Заголовок страницы и SEO-описание можно оставить управляемыми через `[[*pagetitle]]` и `[[*description]]`. Чтобы редактор мог менять маркетинговые тексты, создай соответствующие **Template Variables (TVs)** и используй их в Chunks, например `[[*heroText]]`, после создания такой переменной.

При этом не удаляй классы `.scene-heading`, `.hero-accent` и другие важные селекторы: скрипт печати берёт текст непосредственно из HTML.

Внутренние ссылки на услуги можно заменить ссылками MODX вида `[[~123]]`, но **только после проверки реальных ID ресурсов** в конкретной установке. Пример `123` условный.

## Шаг 6. Назначение Template главной странице

1. Открой Resource главной страницы в дереве ресурсов MODX.
2. Выбери Template **`NBD Home (Vite)`** в настройках ресурса.
3. Сохрани ресурс и очисти кеш MODX.
4. Проверь страницу в тестовом окружении; после проверки переведи изменения в продакшен.
5. Убедись, что остальные страницы продолжают использовать свои прежние шаблоны и файлы.

**Не изменяй общие Header/Footer Chunks**, используемые другими страницами сайта, если не планируешь обновлять их везде. Отдельные чанки `nbdHome*` изолируют новую главную страницу.

---

# 6. Необязательное улучшение: Vite Manifest + MODX Snippet

После каждой новой сборки Vite обычно создаёт JS/CSS с новыми хешами в именах. Если обновления будут регулярными, удобнее использовать **manifest**, чтобы не переписывать пути к файлам вручную.

## Включение манифеста

Добавь к настройке `build` в `vite.config.js`:

```javascript
build: {
  cssCodeSplit: false,
  manifest: true,
}
```

Пересобери проект:

```bash
npm run build -- --base=/assets/nbd-home/
```

Загрузи на сервер **весь** результат сборки, включая скрытый каталог `.vite`:

```text
/assets/nbd-home/.vite/manifest.json
```

## Создание MODX Snippet `NbdViteAssets`

В **MODX Manager → Elements → Snippets** создай Snippet с именем `NbdViteAssets` и вставь следующий код. **Открывающий тег `<?php` не нужен.**

```php
$baseUrl = '/assets/nbd-home/';
$manifestPath = MODX_BASE_PATH . 'assets/nbd-home/.vite/manifest.json';

if (!is_readable($manifestPath)) {
    return '';
}

$manifest = json_decode(file_get_contents($manifestPath), true);

if (!is_array($manifest)) {
    return '';
}

$entry = $manifest['index.html'] ?? null;

if (!is_array($entry) || empty($entry['file'])) {
    return '';
}

$kind = $modx->getOption('kind', $scriptProperties, 'css');

if ($kind === 'js') {
    $src = htmlspecialchars($baseUrl . $entry['file'], ENT_QUOTES, 'UTF-8');
    return '<script type="module" src="' . $src . '"></script>';
}

$cssFiles = $entry['css'] ?? [];

foreach ($manifest as $asset) {
    if (
        is_array($asset) &&
        !empty($asset['file']) &&
        str_ends_with($asset['file'], '.css')
    ) {
        $cssFiles[] = $asset['file'];
    }
}

$tags = [];

foreach (array_unique($cssFiles) as $file) {
    $href = htmlspecialchars($baseUrl . $file, ENT_QUOTES, 'UTF-8');
    $tags[] = '<link rel="stylesheet" href="' . $href . '" />';
}

return implode("\n", $tags);
```

**Требования:** PHP 8+ (из-за `str_ends_with()`), право MODX читать `manifest.json` и соответствие `MODX_BASE_PATH` реальному корню сайта. Если структура файлов хостинга отличается, измени `$manifestPath`.

Затем в Template вместо прямых ссылок на конкретные CSS/JS используй вызовы сниппета:

```html
<head>
  ...
  [[!NbdViteAssets? &kind=`css`]]
</head>
<body>
  ...
  [[!NbdViteAssets? &kind=`js`]]
</body>
```

Этот пример предназначен для текущего проекта с одной точкой входа и единой сборкой CSS. Если позже появятся несколько точек входа, общие импортируемые чанки или обязательная предзагрузка CSS, обработку manifest нужно будет расширить по документации Vite.

**Замечание о безопасности:** `manifest.json` может быть доступен по публичному URL, если лежит внутри веб-корня. В нём нет секретов, но при желании его можно закрыть серверным правилом и оставить доступным для PHP.

---

# 7. Проверка перед запуском

## Отображение и анимации

- [ ] Все четыре экрана показывают свои изображения и затемняющие слои.
- [ ] Обратная прокрутка работает в обе стороны на десктопе.
- [ ] Запуск двигателя, полёт ракеты, hover-подъём/наклон и усиление пламени при скролле работают.
- [ ] Эффект печати текста и анимация карточек запускаются один раз.
- [ ] Меню, подменю, фон меню, кнопка закрытия и управление клавиатурой работают.
- [ ] Шапка меняет фон только при видимости `#contact`.
- [ ] На мобильных устройствах используется обычная прокрутка; интерактивные элементы не перекрыты ракетой.
- [ ] При `prefers-reduced-motion: reduce` содержимое доступно без навязчивых анимаций.
- [ ] Баннер cookies появляется, закрывается и запоминает выбор пользователя.
- [ ] Логотипы, иконки, шрифты, SVG и WebP загружаются без ошибок.

## Технические проверки

- [ ] Команда `npm run build` завершается без ошибок.
- [ ] Во вкладке **DevTools → Network** нет 404 для JS, CSS, изображений и шрифтов.
- [ ] Во вкладке **DevTools → Console** нет ошибок импорта и необработанных ошибок JavaScript.
- [ ] Сервер отдаёт файлы с правильными MIME-типами (JS/CSS/WebP).
- [ ] Вёрстка проверена на широких, узких и невысоких экранах.
- [ ] Проведены проверки Lighthouse / Core Web Vitals, особенно загрузки первого фонового изображения и шрифтов.
- [ ] У страницы один логический `<h1>`, корректные title, description и canonical (если используется на сайте).

## Обязательно для рабочего сайта

- [ ] **Подключить реальную отправку формы.** В MODX можно использовать дополнение **FormIt** с серверной валидацией, почтовыми обработчиками, защитой от спама и уведомлением об успешной/ошибочной отправке. Демонстрационный обработчик в `contactForm.js` нужно заменить или удалить.
- [ ] **Связать согласие на cookies с аналитикой и маркетинговыми скриптами** согласно политике сайта и применимым требованиям.
- [ ] Проверить юридическую информацию, контакты и внутренние ссылки.
- [ ] Удалить старые скрипты и стили главной страницы, конфликтующие с новым решением.
- [ ] Убедиться, что весь сайт и ресурсы работают по HTTPS.
- [ ] Сохранить предыдущую рабочую версию Template, Chunks и ассетов для отката.

## 8. Возможные проблемы и решения

| Проблема | Причина и решение |
| --- | --- |
| `Failed to resolve import './components'` | Проверь наличие `src/components/index.js` и соответствие экспортов. Запускай проект через Vite. |
| `does not provide an export named ...` | В одном из модулей отсутствует нужный именованный экспорт. Проверь `components/index.js`. |
| `Unknown at rule @apply` в VS Code | Установи Tailwind CSS IntelliSense и переключи язык файла в режим Tailwind CSS. Само предупреждение редактора не означает ошибку сборки. |
| В MODX пропали стили | Не загрузился собранный CSS, изменился хеш файла или указан неверный URL. |
| Не видно ракеты | Удали из MODX-разметки исходный путь `/src/assets/...`; проверь выполнение JS и наличие файла ракеты в сборке. |
| Прокрутка или ракета работают некорректно | Проверь повторную инициализацию JS и наличие старых Skrollr/scroll-скриптов. |
| Не запускается печать текста | Проверь обязательные DOM-селекторы, правильность загрузки JS и наличие видимого блока. |
| Шапка не затемняется | Убедись, что `#contact` есть в DOM и реально пересекается с viewport. |
| Нет иконок услуг или платёжных систем | Проверь пути к изображениям `nbd.by` и существование файлов. |
| Локально CSS-класс работает, в MODX — нет | Tailwind не увидел класс при сборке; добавь его в локальный исходник или `@source inline()` и пересобери. |
| 404 ресурсов на вложенных страницах | Проверь `base: '/assets/nbd-home/'`, путь загрузки и настройки `<base href="[[++site_url]]">`. |
| После загрузки изменений отображается старая версия | Очисти кеш MODX/CDN, проверь ссылки на новые хешированные файлы и обнови страницу без кеша. |
| Форма показывает только демонстрационное сообщение | Это ожидаемо до реализации серверной обработки. |
| Выбор cookies не отключает аналитику | Это ожидаемо, пока загрузка аналитических скриптов не зависит от сохранённого согласия. |

## 9. Обновление и выпуск новых версий

1. Измени код в локальном проекте и проверь его через `npm run dev`.
2. Синхронизируй локальную HTML-разметку с MODX Chunks, чтобы Tailwind видел новые классы.
3. Выполни `npm run build -- --base=/assets/nbd-home/`.
4. Загрузи новые файлы из `dist/`. **Не удаляй старые файлы с хешами до проверки новой версии.**
5. При ручном подключении обнови ссылки на CSS/JS в Template. При использовании Snippet загрузи новый manifest.
6. Очисти кеш MODX и протестируй главную страницу, меню, анимации, форму и cookies.
7. Сохрани предыдущую версию файлов и Template для быстрого отката.

## 10. Полезная документация

- [Vite — начало работы](https://vite.dev/guide/)
- [Vite — production-сборка и base path](https://vite.dev/guide/build)
- [Vite — интеграция с backend и manifest](https://vite.dev/guide/backend-integration)
- [Tailwind CSS — интеграция с Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS — поиск классов в исходниках](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [MODX — Templates](https://docs.modx.com/3.x/en/building-sites/integrating-templates)
- [MODX — синтаксис тегов](https://docs.modx.com/current/en/building-sites/tag-syntax/common)
- [MODX — Snippets](https://docs.modx.com/current/en/building-sites/elements/snippets)
- [MODX — дружественные URL](https://docs.modx.com/current/en/getting-started/friendly-urls)
- [MODX — FormIt](https://docs.modx.com/current/en/extras/formit/index)

---

**Статус:** документ описывает порядок интеграции, но не означает, что обновлённая главная страница уже опубликована в MODX. Перед переносом в продакшен проверь версию CMS, PHP, структуру хостинга и доступность файлов на тестовом окружении.
