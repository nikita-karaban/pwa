<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const authed = useState<boolean | null>('authed')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  if (busy.value || !password.value) return
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/login', { method: 'POST', body: { password: password.value } })
    authed.value = true
    await navigateTo('/dishes', { replace: true })
  } catch (e: any) {
    error.value = e?.statusCode === 401 ? 'Неверный пароль' : 'Не удалось войти, попробуй ещё раз'
    password.value = ''
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <form class="login" @submit.prevent="submit">
    <h1>Заготовки</h1>
    <p class="muted">Введи пароль, чтобы открыть приложение.</p>
    <label class="field" for="password">
      <span>Пароль</span>
      <input id="password" v-model="password" class="input" type="password" autocomplete="current-password" autofocus />
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button class="btn btn--primary" type="submit" :disabled="busy || !password">
      {{ busy ? 'Входим…' : 'Войти' }}
    </button>
  </form>
</template>

<style scoped>
.login {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login h1 {
  font-size: 26px;
  font-weight: 600;
}

.login p {
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}
</style>
