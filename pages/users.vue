<template>
    <v-container>
        <v-row>
            <v-col>
                <v-data-table :items="users"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])

onMounted(async () => {
  users.value = await $fetch('/api/users')
})

const user_headers_no = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
]

</script>