<template>
    <v-container>
        <h2>Manage Categories</h2>

        <v-row>
          <v-col class="text-right">
            <d-categoriesdialog @refresh="refreshCategories"/>
            <d-btn icon="mdi-bug" @click="debug = !debug" />
            <d-btn icon="mdi-refresh" @click="refreshCategories" />
          </v-col>
        </v-row>

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
                    <d-btn icon="mdi-delete" @click="deleteCategory(item)" />
                  </template>            
            </d-table>
          </v-col>
        </v-row>
        
        <v-divider color="black" thickness="1"></v-divider>
        <pre v-if="debug">{{ dialogcategories }}</pre>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const dialogcategories = ref([])
  const debug = ref(false)
  
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
  
  // Delete Category
  const deleteCategory = async (item) => {
    await $fetch('/api/categories', {
      method: 'DELETE',
      body: item
    })
  refreshCategories()
  }

  const refreshCategories = async () => {
    const { data: categoriesData} = await useFetch('/api/categories')
    dialogcategories.value = categoriesData.value
  }

  </script>
  