<template>
    <v-container>
        <h2>Manage Categories</h2>
        <v-row>
          <v-col>
            <d-table 
              :items="dialogcategories"
              :headers="categoriesHeaders"
              :show=true
              >
                  <template v-slot:item.icon="{ item }">
                      <v-icon :icon=item.icon></v-icon>
                  </template>
                  <template v-slot:item.actions="{ item }">
                      <d-delbtn @click="deleteCategory(item)"/>
                  </template>            
            </d-table>
          </v-col>
        </v-row>
        
        <v-divider color="black" thickness="1"></v-divider>

        <!-- Add Category Dialog -->
        <v-dialog v-model="isCategoriesDialogOpen" max-width="500">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="surface-variant"
              class="mt-2"
              variant="flat"
            >
              Add Category
            </v-btn>
          </template>

          <v-card>
            <v-card-title>Add Category</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
                <v-text-field label="Category Name" v-model="dialogcategory.name" :rules="nameRules" required></v-text-field>
                <v-text-field label="Category Icon" v-model="dialogcategory.icon" :rules="iconRules" required></v-text-field>  
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text="Add" @click="submitForm">Add</v-btn>
              <v-btn text="Close" @click="closeDialog">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          notext="Debug"
          color="surface"
          class="ml-2 mt-2"
          variant="flat"
          icon="mdi-bug"
          @click="debug = !debug"
        ></v-btn>
        <pre v-if="debug">{{ dialogcategories }}</pre>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  // import { useFetch } from '#app'
  
  const dialogcategory = ref({
    name: '',
    icon: ''
  })
  
  const dialogcategories = ref([])
  const isFormValid = ref(false)
  const isCategoriesDialogOpen = ref(false)
  const debug = ref(false)
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
 
  const iconRules = [
    v => !!v || 'Icon is required',
  ]

  const categoriesHeaders = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'IconText', key: 'icontxt', value: item => `${item.icon}`, align: 'start' },
    { title: 'Icon', key: 'icon', align: 'start' },
    { title: 'Actions', key: 'actions', align: 'start', width: '5%', sortable: false },
  ]

  // Fetch Data
  onMounted(async () => {
    const { data: categoriesData } = await useFetch('/api/categories')
    dialogcategories.value = categoriesData.value
  })
  
  // Form Submission
  const submitForm = async () => {
    console.log('isFormValid:', isFormValid.value )

    if (!isFormValid.value) return
  
    console.log('dialogcategory:',dialogcategory.value)

    // Send data to API
    try {
      await $fetch('/api/categories', {
        method: 'POST',
        body: dialogcategory.value
      })

      // Refresh Categories
      const { data: categoriesData} = await useFetch('/api/categories')
      dialogcategories.value = categoriesData.value

      // Reset the form and close dialog
      resetForm()
      isCategoriesDialogOpen.value = false
    } catch (error) {
        console.error('Error submitting form:', error)
    }
  }

  // Reset Form
  const resetForm = () => {
    dialogcategory.value = { name: '', icon: '' }
  }

  // Close Dialog without Submission
  const closeDialog = () => {
    resetForm()
    isCategoriesDialogOpen.value = false
  }

  // Delete Category
  const deleteCategory = async (item) => {
    await $fetch('/api/categories', {
      method: 'DELETE',
      body: item
    })

    // Refresh Categories
    const { data: categoriesData} = await useFetch('/api/categories')
    dialogcategories.value = categoriesData.value
  }

  </script>
  