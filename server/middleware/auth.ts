// Все маршруты /api, кроме входа, требуют активной сессии.
export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0] ?? ''
  if (!path.startsWith('/api/')) return
  if (path === '/api/login') return
  if (!(await hasSession(event))) {
    throw createError({ statusCode: 401, statusMessage: 'Нужно войти' })
  }
})
