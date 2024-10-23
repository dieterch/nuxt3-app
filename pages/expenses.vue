<template>
    <v-container>
        <v-row>
            <v-col>
                <v-data-table 
                    :items="expenses"
                    :headers="expense_headers"
                    density="compact"
                    hide-default-footer
                >
                  <template v-slot:item.category.icon="{ item }">
                    <v-icon :icon=item.category.icon></v-icon>
                  </template>              
                </v-data-table>
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

const expense_headers = [
  { title: 'Date', key: 'formateddate', value: item => new Date(item.date).toLocaleDateString()},
  { title: 'Trip', key: 'trip.name' },
  { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
  { title: 'Description', key: 'description', width: "30%", align: "left" },
  { title: 'Expense', 
    key: 'expense',
    value: item => `${item.amount} ${item.currency}`},
  { title: 'User', key: 'user.name' },
]

</script>