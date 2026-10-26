// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // Личное приложение за паролем: без SSR, оболочка статическая, данные приходят из /api.
  ssr: false,
  modules: ['@vite-pwa/nuxt'],
  css: ['~/assets/main.css'],

  runtimeConfig: {
    // Задаются переменными NUXT_APP_PASSWORD и NUXT_SESSION_SECRET (см. README).
    appPassword: '',
    sessionSecret: '',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Заготовки',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0B7A66' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Заготовки' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png' },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    // wrangler.jsonc ведём вручную, чтобы привязка к базе D1 была видна в репозитории.
    cloudflare: { deployConfig: false, nodeCompat: true },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Заготовки',
      short_name: 'Заготовки',
      description: 'Заготовки на неделю: рецепты, КБЖУ, список покупок и морозилка',
      lang: 'ru',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      theme_color: '#0B7A66',
      background_color: '#EDF2F4',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//],
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
    },
    client: { installPrompt: false },
    devOptions: { enabled: false },
  },
})
