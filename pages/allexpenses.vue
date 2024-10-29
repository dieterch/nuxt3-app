<template>
    <v-container>
        <v-row>
            <v-col>
                <d-table 
                    :items="expenses"
                    :headers="expense_headers"
                    :show=true
                    :sort-by="sortBy"
                >
                  <template v-slot:item.category.icon="{ item }">
                    <v-icon :icon=item.category.icon></v-icon>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <d-delbtn @click="deleteExpense(item)"/>
                    <!--v-btn
                      class="ma-2"
                      rounded="0"
                      size="x-small"
                      nocolor="grey"
                      elevation="2"
                      @click="deleteExpense(item)"
                      icon="mdi-delete"
                    ></v-btn-->
                </template>            
                </d-table>
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


const sortBy = [{ key: 'date', order: 'desc' }]
const expense_headers = [
  { title: 'Date', key: 'formateddate', value: item => new Date(item.date).toLocaleDateString(), sortable: "false"},
  { title: 'Trip', key: 'trip.name', sortable: "false"},
  { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
  { title: 'Description', key: 'description', width: "30%", align: "left" },
  { title: 'Expense', 
    key: 'expense',
    value: item => `${item.amount} ${item.currency}`},
  { title: 'User', key: 'user.name' },
  { title: 'Actions', key: 'actions', width: "5%", sortable: false },
]

// Delete Expense
const deleteExpense = async (item) => {
  await $fetch('/api/expenses', {
    method: 'DELETE',
    body: item,
  })

  // Refresh trips
  expenses.value = await $fetch('/api/expenses')
}

</script>