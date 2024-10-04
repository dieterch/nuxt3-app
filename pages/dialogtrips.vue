<template>
    <v-container>
        <h2>Manage Trips</h2>
      <v-row>
            <v-col>
                <v-data-table :items="dialogtrips"></v-data-table>
            </v-col>
      </v-row>
      <v-divider></v-divider>
        <!-- Hier fügst du das Formular für Trips ein-->
        <v-form v-model="isFormValid" ref="form">
        <v-text-field label="Trip Name" v-model="dialogtrip.name" :rules="nameRules" required></v-text-field>
        <v-row>
            <v-col>
                <v-date-picker 
                    v-model="dialogtrip.startDate"
                    no-hide-header
                    title="Start Date" 
                    required 
                    show-adjacent-months></v-date-picker>
            </v-col>
            <v-col>
                <v-date-picker 
                    v-model="dialogtrip.endDate" 
                    no-hide-header
                    title="End Date" 
                    required 
                    show-adjacent-months></v-date-picker>
            </v-col>
        </v-row>
  
        <v-btn @click="submitForm">Add Trip</v-btn>
      </v-form>

    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  const dialogtrip = ref({
    name: '',
    startDate: null,
    endDate: null
  })
  
  const dialogtrips = ref([])
  const isFormValid = ref(false)
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
  
  const { data } = await useFetch('/api/dialogtrips')
  dialogtrips.value = data.value
  
  const submitForm = async () => {
    if (!isFormValid.value) return
  
    await $fetch('/api/dialogtrips', {
      method: 'POST',
      body: dialogtrip.value
    })
    const { data } = await useFetch('/api/dialogtrips')
    dialogtrips.value = data.value
  }

  </script>
  