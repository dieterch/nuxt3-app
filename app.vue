<!--template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template-->

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="user_headers" :items="users"></v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :headers="expense_headers" :items="expenses"></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const expenses = ref([])

onMounted(async () => {
  users.value = await $fetch('/api/users')
  expenses.value = await $fetch('/api/expenses')
})

const user_headers_no = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
]

const expense_headers_no = [
  { text: 'ID', value: 'id' },
  { text: 'Date', value: 'date' },
  { text: 'Trip', value: 'tripid' },
  { text: 'Description', value: 'description' },
  { text: 'Amount', value: 'amount' },
  { text: 'Currency', value: 'currency' },
]

</script>
