// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts', '@nuxt/image', '@nuxt/scripts', '@nuxt/ui', '@nuxt/eslint', '@nuxt/scripts', '@nuxt/image', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: 'http://0.0.0.0/api',
    },
  },
})