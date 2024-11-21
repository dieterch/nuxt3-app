// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  devServer: {
    host: "0.0.0.0",
    port: 3003
  },
  runtimeConfig: {
    public: {    
      JWT_SECRET: process.env.JWT_SECRET,
      DO_NOT_USE_AUTH: process.env.DO_NOT_USE_AUTH,
      SERVER_ADDRESS: process.env.SERVER_ADDRESS,
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  vite: {
    build: {
      target: 'esnext'
    },
    optimizeDeps: {
      esbuildOptions: {
        format: 'esm', // Force Vite to handle modules as ESM
      },
    },
    plugins: [
      vuetify(),
    ],
    // define: {
    //  'process.env.DEBUG': false,
    // },
  },
})
