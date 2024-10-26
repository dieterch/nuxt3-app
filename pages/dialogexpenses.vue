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
          <v-btn
            v-bind="props"
            color="surface-variant"
            class="mt-2"
            variant="flat"
            :disabled="!selectedTrip"
          >
            Add Expense
          </v-btn>
          <v-btn
            notext="Debug Trip"
            color="surface"
            class="ml-2 mt-2"
            variant="flat"
            icon="mdi-debug-step-into"
            @click="debug = !debug"
          ></v-btn>
          <v-btn
            notext="Test"
            color="surface"
            class="ml-2 mt-2"
            variant="flat"
            icon="mdi-refresh"
            @click="tripChanged"
          ></v-btn>
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

      <v-divider color="black" thickness="1" class="mt-2 mb-2"></v-divider>

      <v-row>
            <v-col>
                <v-data-table 
                    :items="filteredexpenses"
                    :headers="expense_headers"
                    v-model:sort-by="sortBy"
                    density="compact"
                    hide-default-footer
                >
                  <template v-slot:item.category.icon="{ item }">
                    <v-icon :icon=item.category.icon></v-icon>
                  </template>
                  <template v-slot:item.actions="{ item }">
                  <v-btn
                    class="ma-2"
                    rounded="0"
                    size="x-small"
                    color="grey"
                    elevation="2"
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

  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'

  const formData = ref({
    amount: null,
    currency: '€',
    date: new Date(),
    location: '',
    categoryId: null,
    description: '',
    //trip: null,
    tripId: '',
    //user: null,
    userId: 'f396dc66-1674-407c-96ad-b6ca5e11b7b7',
  })
  
  const isFormValid = ref(false)
  const isDialogOpen = ref(false)
  const dialogtrips = ref([])
  //const dialogusers = ref([])
  const dialogcategories = ref([])
  const selectedTrip = ref('')
  // const expenses = ref([])
  const filteredexpenses = ref([])
  const debug = ref(false)

  // Fetch Data
  onMounted(async () => {
    const { data: tripsData } = await useFetch('/api/dialogtrips')
    dialogtrips.value = tripsData.value

    //const { data: usersData } = await useFetch('/api/dialogusers')
    //dialogusers.value = usersData.value

    const { data: categoriesData } = await useFetch('/api/dialogcategories')
    dialogcategories.value = categoriesData.value

    //tripChanged()
  })
  
  const sortBy = [{ key: 'date', order: 'desc' }]
  const expense_headers = [
    { title: 'Date', key: 'formateddate', width: "5%", value: item => new Date(item.date).toLocaleDateString(), sortable: "false", align: "end"},
    // { title: 'Trip', key: 'trip.name', sortable: "false"},
    { title: 'Cat', key: 'category.icon', width: "5%", align: "left" },
    { title: 'Description', key: 'description', align: "left" },
    { title: 'Expense', 
      key: 'expense',
      width: "5%",
      value: item => `${item.amount} ${item.currency}`},
    { title: 'User', key: 'user.name' , width: "5%"},
    { title: 'Actions', key: 'actions', width: "5%", sortable: false },
  ]


  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
  ]
    
  const submitExpense = async () => {
    if (!isFormValid.value) return

    console.log('Submitted Data before:', formData.value)
    // Add logic to submit the data via your API
    formData.value.tripId = selectedTrip.value.id
    formData.value.amount = parseFloat(formData.value.amount)

    console.log('Submitted Data after:', formData.value)
    
    // Send data to API
    try {
      await $fetch('/api/dialogexpenses', {
        method: 'POST',
        body: formData.value,
      })

      // Reset the form and close dialog
      resetForm()
      tripChanged()
      isDialogOpen.value = false
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error)
    }
  }

    // Reset Form
    const resetForm = async () => {
    formData.value = {
        amount: null,
        currency: '€',
        date: new Date(),
        location: '',
        categoryId: null,
        description: '',
        //trip: null,
        tripId: '',
        //user: null,
        userId: 'f396dc66-1674-407c-96ad-b6ca5e11b7b7',
      }
      const { data } = await useFetch('/api/expenses')
      expenses.value = data.value
    }

  // Close Dialog without Submission
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
      } catch (error) {
        console.error('Error calling filtered expenses:', error)
        alert(error)
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
  