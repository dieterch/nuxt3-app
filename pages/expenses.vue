<template>
    <v-container>
        <v-row>
            <v-col>
                <v-data-table :items="expenses"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const expenses = ref([])

onMounted(async () => {
  expenses.value = await $fetch('/api/expenses')
})

const expense_headers_no = [
  { text: 'ID', value: 'id' },
  { text: 'Date', value: 'date' },
  { text: 'Trip', value: 'tripid' },
  { text: 'Description', value: 'description' },
  { text: 'Amount', value: 'amount' },
  { text: 'Currency', value: 'currency' },
]

</script>