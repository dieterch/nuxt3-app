<template>
    <v-container>
      <h2>Manage Users</h2>

      <v-row>
        <v-col class="text-right">
          <d-usersdialog @refresh="refreshUsers"/>
          <d-btn icon="mdi-bug" @click="debug = !debug" />
          <d-btn icon="mdi-refresh" @click="refreshUsers" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <d-table 
            :items="dialogusers"
            :headers="usersHeaders"
            :show=true
          >
            <template v-slot:item.actions="{ item }">
              <d-btn icon="mdi-delete" @click="deleteUser(item)" />
            </template>
          </d-table>
        </v-col>
      </v-row>

      <v-divider color="black" thickness="1"></v-divider>
      <pre v-if="debug">{{ dialogusers }}</pre>
    </v-container>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  
  const dialogusers = ref([])
  const isFormValid = ref(false)
  const debug = ref(false)
  
  const usersHeaders = [
    { title: 'Email', key: 'email', width: "20%", align: 'start' },
    { title: 'Name', key: 'name', width: "auto", align: 'start' },
    { title: 'Actions', key: 'actions', width: "5%", sortable: false },
  ]

  // Fetch Data
  onMounted(async () => {
    const { data: usersData } = await useFetch('/api/users')
    dialogusers.value = usersData.value
  })
  
  // Delete User
  const deleteUser = async (item) => {
    await $fetch('/api/users', {
      method: 'DELETE',
      body: item
    })
  refreshUsers()
  }

  const refreshUsers = async () => {
    const { data } = await useFetch('/api/users')
    dialogusers.value = data.value
  }
</script>
  