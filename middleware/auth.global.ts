// Пока проверка сессии не сделана, спрашиваем сервер один раз; дальше помним ответ в состоянии.
export default defineNuxtRouteMiddleware(async (to) => {
  const authed = useState<boolean | null>('authed', () => null)

  if (authed.value === null) {
    try {
      await $fetch('/api/session')
      authed.value = true
    } catch {
      authed.value = false
    }
  }

  if (!authed.value && to.path !== '/login') return navigateTo('/login')
  if (authed.value && to.path === '/login') return navigateTo('/dishes')
})
