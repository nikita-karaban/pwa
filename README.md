# Заготовки

Личное приложение для готовки на неделю: рецепты с КБЖУ, план порций, список покупок и учёт морозилки.
Спецификация лежит в документе «Заготовки: спецификация приложения».

Стек: Nuxt 3 (SPA), TypeScript, Cloudflare Workers + D1, PWA.

## Статус

Этап 1 из 5 («Каркас»): вход по паролю, нижняя панель с четырьмя вкладками-заглушками, PWA, схема базы D1.
Рецепты, продукты, план, покупки и морозилка появятся на следующих этапах.

## Локальный запуск

```bash
npm install
cp .env.example .env            # впиши свой пароль и секрет
cp .env .dev.vars               # те же значения нужны wrangler
npm run build
npm run db:migrate:local        # создаёт таблицы в локальной D1
npm run preview                 # http://localhost:8787
```

Для быстрой разработки интерфейса подойдёт `npm run dev` (без D1, API входа работает).
Проверка базы: после входа открой `/api/health`, там должен быть список из пяти таблиц.

## Деплой на Cloudflare

Эти шаги я в своей среде проверить не мог: к Cloudflare у меня нет доступа. Локально всё проверено через `wrangler dev`.

1. `npx wrangler login`
2. `npx wrangler d1 create zagotovki`, затем вставь выданный `database_id` в `wrangler.jsonc`.
3. `npm run db:migrate:remote`
4. `npm run deploy`
5. Задай секреты (без них вход вернёт ошибку 500):
   ```bash
   npx wrangler secret put NUXT_APP_PASSWORD
   npx wrangler secret put NUXT_SESSION_SECRET    # например, результат `openssl rand -base64 32`
   ```
6. Открой адрес вида `https://zagotovki.<твой-поддомен>.workers.dev` и добавь страницу на экран телефона.

Автодеплой из GitHub: в панели Cloudflare открой Workers & Pages, подключи репозиторий, сборка `npm run build`, команда деплоя `npx wrangler deploy`. Секреты тогда задаются в настройках Worker.

## Как устроен вход

Один пароль из `NUXT_APP_PASSWORD`. После входа сервер ставит подписанный cookie (HMAC-SHA256, 30 дней, httpOnly).
Все маршруты `/api/*`, кроме `/api/login`, без cookie отвечают 401.
Выход очищает cookie в браузере; сам токен без состояния, поэтому старый cookie остаётся действительным до конца срока.
Чтобы разлогинить всё сразу, смени `NUXT_SESSION_SECRET`.
