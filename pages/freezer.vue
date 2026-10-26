<script setup lang="ts">
const logoutBusy = ref(false)
const authed = useState<boolean | null>('authed')

async function logout() {
  logoutBusy.value = true
  try {
    await $fetch('/api/logout', { method: 'POST' })
  } finally {
    authed.value = false
    logoutBusy.value = false
    await navigateTo('/login', { replace: true })
  }
}
</script>

<template>
  <section class="stub">
    <p>Здесь будут партии в морозилке: что и когда заготовлено, сколько порций осталось.</p>
    <button class="btn" type="button" :disabled="logoutBusy" @click="logout">Выйти</button>
  </section>
</template>

<style scoped>
.stub {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  color: var(--muted);
}

.stub p {
  margin: 0;
}
</style>
