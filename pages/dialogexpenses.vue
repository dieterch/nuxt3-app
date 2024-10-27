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

      <!-- Add Trip Dialog -->
      <v-dialog v-model="isDialogOpen" max-width="500">
        <template #activator="{ props }">
        <v-row justify="start">
          <v-col>
            <v-btn
              v-bind="props"
              color="surface-variant"
              rounded="0"
              elevation="1"
              :disabled="!selectedTrip"
            >
              Add Expense
            </v-btn>
          </v-col>
          <v-col>
            <v-sheet>
              {{ totalExpenses }}€ - {{ totalDays }} days<br>
              {{ expensePerDay }}€ per day.<br>
            </v-sheet>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="text-right">
            <v-btn
              notext="Debug Trip"
              rounded="0"
              elevation="1"
              color="surface"
              size="x-small"
              icon="mdi-bug"
              @click="debug = !debug"
            ></v-btn>        
            <v-btn
              notext="Test"
              rounded="0"
              color="surface"
              elevation="1"
              size="x-small"
              icon="mdi-refresh"
              @click="tripChanged"
            ></v-btn>
          </v-col>
        </v-row>
        </template>

        <v-card>
          <v-card-title>Add Expense - {{ selectedTrip.name }}</v-card-title>
          <v-card-text>
 
          <v-form ref="expenseForm" v-model="isFormValid" lazy-validation>
            <v-row>
              <!-- Description Input -->
              <v-col cols="12" md="8">
                <v-text-field
                  density="compact"
                  v-model="formData.description"
                  label="Title"
                  placeholder="brief description of the expense"
                  required
                  :rules="[v => !!v || 'Description is required']"
                ></v-text-field>
              </v-col>
              <!-- Category Dropdown -->
              <v-col cols="12" md="4">
                <v-select
                  density="compact"
                  v-model="formData.categoryId"
                  :items="dialogcategories"
                  item-title="name"
                  item-value="id"
                  label="♥"
                  required
                  :rules="[v => !!v || 'required']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
            <!-- Currency Dropdown -->
            <v-col cols="12" md="3">
                <v-select
                  density="compact"
                  v-model="formData.currency"
                  :items="currencies"
                  item-title="symbol"
                  item-value="symbol"
                  nolabel="Currency"
                  required
                  :rules="[v => !!v || 'required']"
                ></v-select>
              </v-col> 
              <!-- Amount Input -->
              <v-col cols="12" md="9">
                <v-text-field
                  density="compact"
                  v-model="formData.amount"
                  type="number"
                  label="Amount"
                  required
                  :rules="[v => !!v || 'Amount is required']"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>

              <!-- User Dropdown -->
              <v-col cols="12" md="6">
                <v-select
                  density="compact"
                  v-model="formData.userId"
                  :items="selectedTrip.users"
                  item-title="user.name"
                  item-value="user.id"
                  label="Select User"
                  required
                  :rules="[v => !!v || 'User is required']"
                ></v-select>
              </v-col>

              <!-- Date Input -->
              <v-col cols="12" md="6">
                  <v-date-input
                    density="compact"
                    v-model="formData.date"
                    label="Expense Date"
                    required
                    :rules="[v => !!v || 'Date is required']"
                  ></v-date-input>
              </v-col>
            </v-row>
          </v-form>
            
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Add" @click="submitExpense" :disabled="!isFormValid">Add</v-btn>
            <v-btn text="Close" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-row>
            <v-col>
                <v-data-table 
                    :items="filteredexpenses"
                    :headers="expense_headers"
                    v-model:sort-by="sortBy"
                    density="compact"
                    hide-default-footer
                    v-if="selectedTrip"
                >
                  <template v-slot:item.category.icon="{ item }">
                    <v-icon :icon=item.category.icon></v-icon>
                  </template>
                  <template v-slot:item.actions="{ item }">
                  <v-btn
                    class="ma-2"
                    rounded="0"
                    size="x-small"
                    nocolor="grey"
                    elevation="1"
                    @click="deleteExpense(item)"
                    icon="mdi-delete"
                  ></v-btn>
                </template>            
                </v-data-table>
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
  import { useFetch } from '#app'
  import VueCookies from 'vue-cookies'

  // Ref Variables
  const formData = ref({
    amount: null,
    currency: '€',
    date: new Date(),
    location: '',
    categoryId: null,
    description: '',
    tripId: '',
    userId: '',
  })
  
  // Reset the Form
  const resetForm = async () => {
    formData.value.amount = null
    formData.value.date = new Date()
    formData.value.description = ''
    formData.value.categoryId = null  
    
    const { data } = await useFetch('/api/expenses')
    expenses.value = data.value
  }

  const isFormValid = ref(false)
  const isDialogOpen = ref(false)
  const dialogtrips = ref([])
  const dialogUsers = ref({})
  const dialogcategories = ref([])
  const selectedTrip = ref(null)
  const filteredexpenses = ref([])
  const debug = ref(false)

  const totalExpenses = computed(() => {
    return filteredexpenses.value.reduce( (sum, { amount }) => sum + amount, 0).toFixed(0)
  })

  const totalDays = computed(() => {
    try {
      let startdate = selectedTrip.value.startDate
      let lastdate = filteredexpenses.value[0].date
      // console.log("lastdate before", lastdate)
      filteredexpenses.value.forEach((rec) => { lastdate = (lastdate > rec.date) ? lastdate : rec.date})
      let diff = (new Date(lastdate) - new Date(startdate))/(1000*60*60*24)
      // console.log("Startdate:", startdate, "Lastdate:", lastdate, "Diff:", diff)
      return diff.toFixed(0)
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

    const { data: tripsData } = await useFetch('/api/dialogtrips')
    dialogtrips.value = tripsData.value
    
    const { data: categoriesData } = await useFetch('/api/dialogcategories')
    dialogcategories.value = categoriesData.value
    
    // reaad selected Trip from cookiev...
    selectedTrip.value = VueCookies.get('selectedTrip')
    console.log("selectedTrip: ",selectedTrip.value)
    
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
    { title: 'Date', key: 'formateddate', width: "5%", value: item => new Date(item.date).toLocaleDateString(), sortable: "false", align: "end"},
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

  //currencies seed => would make sense to transfer this table to the database.
  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
  ]
    
  //Submit the 'add expense' dialog content:
  const submitExpense = async () => {
    if (!isFormValid.value) return

    //DEBUG: console.log('Submitted Data before:', formData.value)


    // Add logic to submit the data via your API
    formData.value.tripId = selectedTrip.value.id
    formData.value.amount = parseFloat(formData.value.amount)

    //DEBUG: console.log('Submitted Data after:', formData.value)
    
    // Send data to API
    try {
      await $fetch('/api/dialogexpenses', {
        method: 'POST',
        body: formData.value,
      })

      // Reset the form
      resetForm()
      // update the filtered Expenses List and set the cookie
      // in order to display the added row.
      tripChanged()

      // close the Dialog form
      isDialogOpen.value = false
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error)
    }
  }

  // Close Dialog without Submission of data
  const closeDialog = () => {
    resetForm()
    isDialogOpen.value = false
  }

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
    await $fetch('/api/dialogexpenses', {
      method: 'DELETE',
      body: item,
    })

    // Refresh expenses
    tripChanged()
  }

  </script>
  