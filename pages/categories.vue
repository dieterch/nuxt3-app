<template>
    <v-container>
        <v-row>
            <v-col>
                <v-data-table :items="categories"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])

onMounted(async () => {
  categories.value = await $fetch('/api/categories')
})

const user_headers_no = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
]

</script>