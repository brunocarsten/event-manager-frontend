// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxt/scripts', '@nuxt/ui', '@nuxt/eslint', '@nuxt/scripts', '@nuxt/image', '@nuxt/fonts'],

  icon: {
    // @ts-expect-error import iconify
    provider: 'lucide',
    serverBundle: false,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: 'http://98.85.81.46/api',
    },
  },
})