<template>
  <v-container>
  </v-container>
</template>

<script setup>

  // definePageMeta({
  //     middleware: 'auth'
  //   })

  import { onMounted } from 'vue'
  onMounted( () => {
    navigateTo("/expenses")
  })
</script>