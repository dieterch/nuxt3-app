<template>
    <v-container>
        <v-row>
            <v-col>
                <v-data-table :items="trips"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const trips = ref([])

onMounted(async () => {
  trips.value = await $fetch('/api/trips')
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