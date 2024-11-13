<template>
    <v-container>
        <d-appbar />
        <v-row>
          <!--v-col md="6">
            <d-statistics
              :key="expenses"
              :expenses="expenses"
              :v-bind="expenses"
            />
          </v-col-->
          <v-col class="text-right">
          <d-savefile 
            :key="expenses"
            mode="all"
            :v-bind="expenses"/>
          <d-btn icon="mdi-bug" @click="debug = !debug" v-if="uRole(['admin'])"/>
          <d-btn icon="mdi-refresh" @click="fetchAllExpenses" />
        </v-col>
    </v-row>
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
                    <d-btn icon="mdi-delete" @click="deleteExpense(item)" />
                </template>            
                </d-table>
            </v-col>
        </v-row>
        <div v-if="debug">
          All Expenses:
        <pre>{{ expenses }}</pre>
    </div>

    </v-container>
</template>


<script setup>

  definePageMeta({
    middleware: 'auth'
  })

import { useUserInfo } from '~/composables/useUserInfo'
const { userInfo, loggedIn, uRole, fetchUserInfo } = useUserInfo()


import { ref, onMounted } from 'vue'
import { confirmDialog } from 'vuetify3-dialog'

const expenses = ref([])
const debug = ref(false)

const fetchAllExpenses = async () => {
    const data = await $fetch('/api/expenses')
    expenses.value = data
  }

onMounted(async () => {
  await fetchUserInfo()
  fetchAllExpenses()
})

const sortBy = [{ key: 'date', order: 'desc' }]
const expense_headers = [
  { title: 'Date', key: 'formateddate', value: item => new Date(item.date).toLocaleDateString(), sortable: "false"},
  { title: 'Trip', key: 'trip.name', width: "25%", sortable: "false"},
  { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
  { title: 'Description', key: 'description', width: "30%", align: "left" },
  { title: 'Expense', key: 'expense', value: item => `${item.amount} ${item.currency}`, align: "end"},
  { title: 'User', key: 'user.name' },
  { title: 'Actions', key: 'actions', width: "5%", sortable: false },
]

// Delete Expense
const deleteExpense = async (item) => {

  let permit = await confirmDialog({ 
            title: "Please Confirm", 
            text: `Delete "${item.description}". Continue?`,
            level: 'warning',
            // icon: 'mdi-emoticon-happy-outline',
            cancelText: 'Cancel',
            confirmationText: 'Ok',
        })

  if ( permit ) {

    await $fetch('/api/expenses', {
      method: 'DELETE',
      body: item,
    })
    // Refresh expenses
    fetchAllExpenses()
  }
}

</script>