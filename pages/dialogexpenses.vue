<template>
    <v-container>
      <v-form ref="expenseForm" v-model="valid" lazy-validation>
        <v-row>
          <!-- Trip Dropdown -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.trip"
              :items="trips"
              item-text="name"
              item-value="id"
              label="Select Trip"
              required
              :rules="[v => !!v || 'Trip is required']"
            ></v-select>
          </v-col>
  
          <!-- User Dropdown -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.user"
              :items="users"
              item-text="name"
              item-value="id"
              label="Select User"
              required
              :rules="[v => !!v || 'User is required']"
            ></v-select>
          </v-col>
        </v-row>
  
        <v-row>
          <!-- Currency Dropdown -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.currency"
              :items="currencies"
              item-text="name"
              item-value="symbol"
              label="Select Currency"
              required
              :rules="[v => !!v || 'Currency is required']"
            ></v-select>
          </v-col>
  
          <!-- Icon Dropdown -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.icon"
              :items="icons"
              item-text="name"
              item-value="icon"
              label="Select Icon"
              required
              :rules="[v => !!v || 'Icon is required']"
            ></v-select>
          </v-col>
        </v-row>
  
        <v-row>
          <!-- Amount Input -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.amount"
              label="Amount"
              type="number"
              required
              :rules="[v => !!v || 'Amount is required']"
            ></v-text-field>
          </v-col>
  
          <!-- Date Input -->
          <v-col cols="12" md="6">
            <v-date-input
              v-model="formData.date"
              label="Expense Date"
              required
              :rules="[v => !!v || 'Date is required']"
            ></v-date-input>
          </v-col>
        </v-row>
  
        <v-row>
          <!-- Location Input -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.location"
              label="Location"
              placeholder="Enter the location of the expense"
              required
              :rules="[v => !!v || 'Location is required']"
            ></v-text-field>
          </v-col>
        </v-row>
  
        <v-row>
          <!-- Description Input -->
          <v-col cols="12">
            <v-textarea
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
  import { ref } from 'vue'
  
  const formData = ref({
    trip: '',
    user: '',
    currency: '',
    icon: '',
    amount: null,
    date: null,
    location: '',
    description: '',
  })
  
  const valid = ref(false)
  
  // Example Data: Replace with real API data
  const trips = [
    { id: 1, name: 'Trip to Paris' },
    { id: 2, name: 'Business Trip to Berlin' },
  ]
  
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]
  
  const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
  ]
  
  const icons = [
    { name: 'Food', icon: 'mdi-food' },
    { name: 'Transport', icon: 'mdi-bus' },
    { name: 'Lodging', icon: 'mdi-hotel' },
  ]
  
  const submitExpense = () => {
    console.log('Submitted Data:', formData.value)
    // Add logic to submit the data via your API
  }
  </script>
  