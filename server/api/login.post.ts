export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: unknown }>(event)
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!(await checkPassword(password))) {
    // Небольшая задержка затрудняет перебор пароля.
    await new Promise((resolve) => setTimeout(resolve, 600))
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }
  await startSession(event)
  return { ok: true }
})
