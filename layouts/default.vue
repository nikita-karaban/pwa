<script setup lang="ts">
const tabs = [
  { to: '/dishes', label: 'Блюда', icon: 'M4 11h16a8 8 0 0 1-8 8 8 8 0 0 1-8-8zM9 6c0-1.5 1.5-1.5 1.5-3M14 6c0-1.5 1.5-1.5 1.5-3' },
  { to: '/plan', label: 'План', icon: 'M5 5h14v14H5zM5 9h14M9 5V3M15 5V3' },
  { to: '/shopping', label: 'Покупки', icon: 'M5 7h14l-1.5 11h-11zM9 7a3 3 0 0 1 6 0' },
  { to: '/freezer', label: 'Морозилка', icon: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5' },
]
const route = useRoute()
const title = computed(() => tabs.find((t) => route.path.startsWith(t.to))?.label ?? 'Заготовки')
</script>

<template>
  <div class="shell">
    <header class="top">
      <h1>{{ title }}</h1>
    </header>
    <main class="content">
      <slot />
    </main>
    <nav class="tabbar" aria-label="Разделы">
      <NuxtLink v-for="t in tabs" :key="t.to" :to="t.to" class="tab">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path :d="t.icon" />
        </svg>
        <span>{{ t.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.top {
  padding: calc(14px + env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 10px max(16px, env(safe-area-inset-left, 0px));
}

.top h1 {
  font-size: 22px;
  font-weight: 600;
}

.content {
  flex: 1;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 8px max(16px, env(safe-area-inset-right, 0px)) 96px max(16px, env(safe-area-inset-left, 0px));
}

.tabbar {
  position: fixed;
  inset: auto 0 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 6px max(8px, env(safe-area-inset-right, 0px)) calc(6px + env(safe-area-inset-bottom, 0px)) max(8px, env(safe-area-inset-left, 0px));
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 48px;
  padding: 4px 0;
  border-radius: 10px;
  color: var(--muted);
  font-size: 12px;
  text-decoration: none;
}

.tab.router-link-active {
  color: var(--accent);
  font-weight: 600;
}
</style>
