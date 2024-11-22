<template>
    <v-container>
        <d-appbar pagetitle="Categories"/>
        <v-row>
          <v-col class="text-right">
            <d-btn icon="mdi-plus" @click="cmode = 'add'; citem={}; isCategoryDialogOpen = true"/>
            <d-categoriesdialog 
              :dialog="isCategoryDialogOpen"
              :key="isCategoryDialogOpen"
              :mode="cmode"
              :item="citem"              
              @refresh="fetchCategories"
              @dialog="(e)=>{isCategoryDialogOpen = e}"
              />
            <d-btn icon="mdi-bug" @click="debug = !debug" v-if="uRole(['admin'])"/>
            <d-btn icon="mdi-refresh" @click="fetchCategories" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <d-table 
              :items="categories"
              :headers="categoriesHeaders"
              :show=true
              >
                  <template v-slot:item.icon="{ item }">
                      <v-icon :icon=item.icon></v-icon>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="button-container">
                      <d-btn icon="mdi-delete" @click="deleteCategory(item)" v-if="uRole(['admin'])"/>
                      <d-btn icon="mdi-square-edit-outline" @click="cmode = 'update'; citem=item; isCategoryDialogOpen = true"/>
                    </div>
                  </template>            
            </d-table>
          </v-col>
        </v-row>
        
        <v-divider color="black" thickness="1"></v-divider>
        <pre v-if="debug">{{ categories }}</pre>
    </v-container>
  </template>
  
  <script setup>

  definePageMeta({
    middleware: 'auth'
  })

  import { useUserInfo } from '~/composables/useUserInfo'
  const { userInfo, loggedIn, uRole, fetchUserInfo } = useUserInfo()

  import { ref, onMounted } from 'vue'
  import { confirmDialog } from 'vuetify3-dialog'

  const { $ifetch } = useNuxtApp();
  import { CapacitorCookies } from "@capacitor/core";

  const categories = ref([])
  const debug = ref(false)
  const isCategoryDialogOpen = ref(false)
  const cmode = ref('')
  const citem = ref({})

  const categoriesHeaders = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Icon', key: 'icon', align: 'start' },
    { title: 'Expenses', key:'countexpenses', value: item => item.expenses.length},
    { title: 'IconText', key: 'icontxt', value: item => `${item.icon}`, align: 'start' },
    { title: 'Actions', key: 'actions', align: 'start', width: '5%', sortable: false },
  ]

  // const fetchCategories = async () => { categories.value = await $fetch('/api/categories') }
  const fetchCategories = async () => { categories.value = await $ifetch.get('/api/categories') }

  // Fetch Data
  onMounted(async () => {
    await fetchUserInfo()
    fetchCategories()
  })
  
  // Delete Category
  const deleteCategory = async (item) => {
    // let permit = (item.expenses.length > 0) ? confirm(`"${item.name}" is used in ${item.expenses.length} expenses. Continue?`):true
    
    let permit =  (item.expenses.length > 0) ? 
        await confirmDialog({ 
            title: "Please Confirm", 
            text: `"${item.name}" is used in ${item.expenses.length} expenses. All connected expenses will be deleted. Continue?`,
            level: 'warning',
            // icon: 'mdi-emoticon-happy-outline',
            cancelText: 'Cancel',
            confirmationText: 'Ok',
        }) : true

    if ( permit ) {
      await $ifetch.delete('/api/categories', {
        data: { id: item.id },
        headers: { "Content-Type": "application/json" },    
      })
      // await $fetch('/api/categories', {
      //   method: 'DELETE',
      //   body: item
      // })
      fetchCategories()
    }
  }

  </script>
  
  <style lang="css" scoped>
.button-container {
  display: flex;
}
</style>