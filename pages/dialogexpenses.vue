<template>
    <v-container>
      <h2>Manage Expenses</h2>

      <v-divider color="black" thickness="1"></v-divider>

      <v-select
              density="compact"
              v-model="selectedTrip"
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
                  placeholder="Provide a brief description of the expense"
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
                  :items="dialogusers"
                  item-title="name"
                  item-value="id"
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

      <!--v-form ref="expenseForm" v-model="isFormValid" lazy-validation>
        <v-row>

          <v-col cols="12" md="4">
            <v-select
              density="compact"
              v-model="formData.tripId"
              :items="dialogtrips"
              item-title="name"
              item-value="id"
              label="Select Trip"
              required
              :rules="[v => !!v || 'Trip is required']"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              density="compact"
              v-model="formData.location"
              label="Location"
              placeholder="Enter the location of the expense"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              density="compact"
              v-model="formData.userId"
              :items="dialogusers"
              item-title="name"
              item-value="id"
              label="Select User"
              required
              :rules="[v => !!v || 'User is required']"
            ></v-select>
          </v-col>
        </v-row>
  
        <v-row>
             <v-col cols="12" md="3">
              <v-date-input
                density="compact"
                v-model="formData.date"
                label="Expense Date"
                required
                :rules="[v => !!v || 'Date is required']"
              ></v-date-input>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              density="compact"
              v-model="formData.categoryId"
              :items="dialogcategories"
              item-title="name"
              item-value="id"
              label="Select Category"
              required
              :rules="[v => !!v || 'required']"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              density="compact"
              v-model="formData.amount"
              type="number"
              label="Amount"
              required
              :rules="[v => !!v || 'Amount is required']"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              density="compact"
              v-model="formData.currency"
              :items="currencies"
              item-title="name"
              item-value="symbol"
              label="Select Currency"
              required
              :rules="[v => !!v || 'required']"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12">
            <v-textarea
              density="compact"
              v-model="formData.description"
              label="Description"
              placeholder="Provide a brief description of the expense"
              required
              :rules="[v => !!v || 'Description is required']"
            ></v-textarea>
          </v-col>
        </v-row>
  
        <v-btn color="primary" @click="submitExpense" :disabled="!isFormValid">
          Submit Expense
        </v-btn>
      </v-form-->

      <pre>{{ selectedTrip }}</pre>
      <!--pre>{{ dialogtrips.value.filter(el => {return dialogtrips.value.id === selectedTrip.value}) }}</pre-->
      <!--pre>{{ dialogtrips.value.filter(el => {return dialogtrips.value.id === '9bb38019-873f-4bf4-8a35-ac4dffb49bf7'}) }}</pre-->
    </v-container>
  </template>
  
  <script setup>

// var result = jsObjects.filter(obj => {
//   return obj.b === 6
// })


  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'

  const formData = ref({
    amount: null,
    currency: '',
    date: null,
    location: '',
    categoryId: null,
    description: '',
    //trip: null,
    tripId: '',
    //user: null,
    userId: '',
  })
  
  const isFormValid = ref(false)
  const isDialogOpen = ref(false)
  const dialogtrips = ref([])
  const dialogusers = ref([])
  const dialogcategories = ref([])
  const selectedTrip = ref('')

  // Fetch Data
  onMounted(async () => {
    const { data: tripsData } = await useFetch('/api/dialogtrips')
    dialogtrips.value = tripsData.value

    const { data: usersData } = await useFetch('/api/dialogusers')
    dialogusers.value = usersData.value

    const { data: categoriesData } = await useFetch('/api/dialogcategories')
    dialogcategories.value = categoriesData.value
  })

  // Example Data: Replace with real API data
  // const trips = [
  //   { id: 1, name: 'Trip to Paris' },
  //   { id: 2, name: 'Business Trip to Berlin' },
  // ]
  
  // const users = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Jane Smith' },
  // ]
  
  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
  ]
  
  // const icons = [
  //   { name: 'Food', icon: 'mdi-food' },
  //   { name: 'Transport', icon: 'mdi-bus' },
  //   { name: 'Lodging', icon: 'mdi-hotel' },
  // ]
  
  const submitExpense = async () => {
    if (!isFormValid.value) return

    console.log('Submitted Data:', formData.value)
    // Add logic to submit the data via your API
    formData.value.tripId = selectedTrip.id
    formData.value.amount = parseFloat(formData.value.amount)

    // console.log('Submitted Data:', formData.value)
    
    // Send data to API
    try {
      await $fetch('/api/dialogexpenses', {
        method: 'POST',
        body: formData.value,
      })

      // Reset the form and close dialog
      resetForm()
      // isDialogOpen.value = false
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error)
    }
  }

    // Reset Form
    const resetForm = () => {
    formData.value = {
        amount: null,
        currency: '',
        date: null,
        location: '',
        categoryId: null,
        description: '',
        //trip: null,
        tripId: '',
        //user: null,
        userId: '',
      }
    }

  // Close Dialog without Submission
  const closeDialog = () => {
    resetForm()
    isDialogOpen.value = false
  }

  </script>
  