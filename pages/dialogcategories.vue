<template>
    <v-container>
        <h2>Manage Categories</h2>
        <v-row>
          <v-col>
            <v-data-table :items="dialogcategories"></v-data-table>
          </v-col>
        </v-row>
        
        <v-divider></v-divider>
        <!-- Hier fügst du das Formular für Users ein-->
      <v-form v-model="isFormValid" ref="form">
        <v-text-field label="Category Name" v-model="dialogcategory.name" :rules="nameRules" required></v-text-field>
        <v-text-field label="Category Icon" v-model="dialogcategory.icon" :rules="iconRules" required></v-text-field>  
        <v-btn @click="submitForm">Add Category</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  const dialogcategory = ref({
    name: '',
    icon: ''
  })
  
  const dialogcategories = ref([])
  const isFormValid = ref(false)
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
 
  const iconRules = [
    v => !!v || 'Icon is required',
  ]

  const { data } = await useFetch('/api/dialogcategories')
  dialogcategories.value = data.value
  
  const submitForm = async () => {
    if (!isFormValid.value) return
  
    await $fetch('/api/dialogcategories', {
      method: 'POST',
      body: dialogcategory.value
    })
    const { data } = await useFetch('/api/dialogcategories')
    dialogcategories.value = data.value
  }

  </script>
  