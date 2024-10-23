<template>
    <v-container>
      <v-form ref="expenseForm" v-model="valid" lazy-validation>
        <v-row>
          <!-- Trip Dropdown -->
          <v-col cols="12" md="4">
            <v-select
              density="compact"
              v-model="formData.trip"
              :items="dialogtrips"
              item-title="name"
              item-value="id"
              label="Select Trip"
              required
              :rules="[v => !!v || 'Trip is required']"
            ></v-select>
          </v-col>

          <!-- Location Input -->
          <v-col cols="12" md="4">
            <v-text-field
              density="compact"
              v-model="formData.location"
              label="Location"
              placeholder="Enter the location of the expense"
            ></v-text-field>
          </v-col>

          <!-- User Dropdown -->
          <v-col cols="12" md="4">
            <v-select
              density="compact"
              v-model="formData.user"
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
            <!-- Date Input -->
             <v-col cols="12" md="3">
              <v-date-input
                density="compact"
                v-model="formData.date"
                label="Expense Date"
                required
                :rules="[v => !!v || 'Date is required']"
              ></v-date-input>
          </v-col>
          <!-- Category Dropdown -->
          <v-col cols="12" md="3">
            <v-select
              density="compact"
              v-model="formData.category"
              :items="dialogcategories"
              item-title="name"
              item-value="name"
              label="Select Category"
              required
              :rules="[v => !!v || 'required']"
            ></v-select>
          </v-col>

          <!-- Amount Input -->
          <v-col cols="12" md="3">
            <v-text-field
              density="compact"
              v-model="formData.amount"
              label="Amount"
              type="number"
              required
              :rules="[v => !!v || 'Amount is required']"
            ></v-text-field>
          </v-col>

          <!-- Currency Dropdown -->
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
          <!-- Description Input -->
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
  
        <!-- Submit Button -->
        <v-btn color="primary" @click="submitExpense" :disabled="!valid">
          Submit Expense
        </v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'

  const formData = ref({
    amount: null,
    currency: '',
    date: null,
    location: '',
    category: '',
    description: '',
    trip: '',
    user: '',
  })
  
  const valid = ref(false)
  const dialogtrips = ref([])
  const dialogusers = ref([])
  const dialogcategories = ref([])

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
  
  const submitExpense = () => {
    console.log('Submitted Data:', formData.value)
    // Add logic to submit the data via your API
  }
  </script>
  