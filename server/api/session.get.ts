// Доступ к этому маршруту уже проверен server/middleware/auth.ts: без сессии он вернёт 401.
export default defineEventHandler(() => ({ ok: true }))
