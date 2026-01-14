// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  modules: ['@nuxt/ui'],
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api'
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  }
})
