<template>
    <v-container>

      <v-divider color="black" thickness="1"></v-divider>

      <v-select
        density="compact"
        v-model="selectedTrip"
        @update:modelValue="tripChanged"
        :items="dialogtrips"
        item-title="name"
        item-value="id"
        label="Select Trip"
        return-object
      ></v-select>

      <v-row>
        <v-col md="4">
          <d-statistics 
            :key="totalDays" 
            :totalDays="totalDays" 
            :totalExpenses="totalExpenses" 
            :expensePerDay="expensePerDay"
           />
        </v-col>
        <v-col class="text-right">
          <d-expensedialog 
            :key="selectedTrip" 
            :selectedTrip="selectedTrip" 
            :v-bind="selectedTrip" 
            @refresh="tripChanged"/>
          <d-btn icon="mdi-bug" @click="debug = !debug" />
          <d-btn icon="mdi-refresh" @click="tripChanged" />
        </v-col>
    </v-row>
    <v-row>
      <v-divider color="black" thickness="1"></v-divider>
    </v-row>
    <v-row>
      <v-col>
        <d-table
          :key="filteredexpenses"
          :items="filteredexpenses"
          :headers="expense_headers"
          :show="selectedTrip"
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
      Selected Trip:
      <pre>{{ selectedTrip }}</pre>

      Filtered Expenses:
      <pre>{{ filteredexpenses }}</pre>
    </div>
    </v-container>
</template>
  
<script setup>
  import { ref, onMounted, computed } from 'vue'
  // import { useFetch } from '#app'
  import VueCookies from 'vue-cookies'

  const dialogtrips = ref([])
  const selectedTrip = ref(null)
  const filteredexpenses = ref([])
  const debug = ref(false)

  const totalExpenses = computed(() => {
    try {
      return filteredexpenses.value.reduce( (sum, { amount }) => sum + amount, 0).toFixed(0)
    } catch(error) {
      console.log(error)
      return 1
    }
  })

  const totalDays = computed(() => {
    try {
      if ((selectedTrip) && (filteredexpenses.value.length > 0)) {
        let startdate = selectedTrip.value.startDate
        let lastdate = filteredexpenses.value[0].date
        // console.log("lastdate before", lastdate)
        filteredexpenses.value.forEach((rec) => { lastdate = (lastdate > rec.date) ? lastdate : rec.date})
        let diff = (new Date(lastdate) - new Date(startdate))/(1000*60*60*24)
        // console.log("Startdate:", startdate, "Lastdate:", lastdate, "Diff:", diff)
        return diff.toFixed(0)
      } else {
        return 1
      }
    } 
    catch(error) {
      console.log(error)
      return 1
    }
  })

  const expensePerDay = computed(() => {
  try {
    return ( totalExpenses.value / totalDays.value ).toFixed(0)
  } catch(error) {
    console.log(error)
    return 1
  }
  })

  // Fetch Data on Mount
  onMounted(async () => {

    const { data: tripsData } = await useFetch('/api/trips')
    dialogtrips.value = tripsData.value
    
    // read selected Trip from cookiev...
    selectedTrip.value = VueCookies.get('selectedTrip')
    //DEBUG: console.log("selectedTrip: ",selectedTrip.value)
    
    // refresh if dialogtrips.
    if (selectedTrip) {
      tripChanged()
    }
  })
  
  //define the expense v-data-table
  //sort is reversed order of dates
  const sortBy = [{ key: 'date', order: 'desc' }]
  //columns definition & optimization
  const expense_headers = [
    //format the date 
    { title: 'Date', key: 'formateddate', width: "5%", value: item => new Date(item.date).toLocaleDateString("de-CA", {year:"numeric", month: "2-digit", day:"2-digit"}), sortable: "false", align: "end"},
    // do not display the Trip Name:
    // { title: 'Trip', key: 'trip.name', sortable: "false"},
    { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
    { title: 'Description', key: 'description', align: "left" },
    //combine amount & Currency into one column:
    { title: 'Expense', key: 'expense', width: "5%", value: item => `${item.amount} ${item.currency}`, align: "end"},
    { title: 'User', key: 'user.name' , width: "5%"},
    //add a column for action buttons
    { title: 'Actions', key: 'actions', width: "5%", sortable: false },
  ]

  // fetch filtered Expenses
  const tripChanged = async () => {
    // Call filtered data from API
    try {
      filteredexpenses.value = await $fetch('/api/tripexpenses', {
          method: 'POST',
          body: { id: selectedTrip.value.id }
      })
      // Store selected Trip in a cookie for 30 days.
      VueCookies.set('selectedTrip', selectedTrip.value, "30d")
    } catch (error) {
        console.error('Error calling filtered expenses:', error)
        // alert(error)
    }
  }

  // Delete Expense
  const deleteExpense = async (item) => {
    await $fetch('/api/expenses', {
      method: 'DELETE',
      body: item,
    })

    // Refresh expenses
    tripChanged()
  }

  </script>
  