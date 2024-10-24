// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0",
    port: 3000
  },
  build: {
    transpile: ['vuetify'],
  },
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  vite: {
    build: {
      target: 'esnext'
    },
    resolve: {
      alias: {
        'vite': 'vite/dist/node/esm.js', // Force ESM version of Vite
      },
      extensions: ['.js', '.ts', '.mjs'],
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
  plugins: ['@/plugins/vuetify'],  
})
