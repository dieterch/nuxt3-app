// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  vite: {
    plugins: [
      vuetify(),
    ],
    define: {
      'process.env.DEBUG': false,
    },
  },
  plugins: ['@/plugins/vuetify'],  
})
