<template>
      <v-container>
      <!--v-row>
        <v-col>
          <h1>Welcome to Expense Management</h1>
          <p>Use the navigation to manage your trips, expenses, users and categories.</p>
        </v-col>
      </v-row-->
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