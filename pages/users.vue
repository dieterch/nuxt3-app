<template>
    <v-container>
      <h2>Manage Users</h2>

      <v-row>
        <v-col class="text-right">
          <d-btn icon="mdi-plus" @click="umode = 'add'; uitem={}; isUserDialogOpen = true"/>
          <d-usersdialog 
            :dialog="isUserDialogOpen"
            :key="isUserDialogOpen"
            :mode="umode"
            :item="uitem"
            @refresh="refreshUsers"
            @dialog="(e)=>{isUserDialogOpen = e}"
            />
          <d-btn icon="mdi-bug" @click="debug = !debug" />
          <d-btn icon="mdi-refresh" @click="refreshUsers" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <d-table 
            :items="users"
            :headers="usersHeaders"
            :show=true
          >
            <template v-slot:item.actions="{ item }">
              <div class="button-container">
                <d-btn icon="mdi-delete" @click="deleteUser(item)" />
                <d-btn icon="mdi-square-edit-outline" @click="umode = 'update'; uitem=item; isUserDialogOpen = true"/>
              </div>
            </template>
          </d-table>
        </v-col>
      </v-row>

      <v-divider color="black" thickness="1"></v-divider>
      <pre v-if="debug">{{ users }}</pre>
    </v-container>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import { confirmDialog } from 'vuetify3-dialog'

  
  const users = ref([])
  // const isFormValid = ref(false)
  const debug = ref(false)
  const isUserDialogOpen = ref(false)
  const umode = ref('')
  const uitem = ref({})
  
  const usersHeaders = [
    { title: 'Email', key: 'email', width: "20%", align: 'start' },
    { title: 'Name', key: 'name', width: "auto", align: 'start' },
    { title: 'Expenses', key:'countexpenses', value: item => item.expenses.length},
    { title: 'Trips', key:'counttrips', value: item => item.trips.length},
    { title: 'Actions', key: 'actions', width: "5%", sortable: false },
  ]

  const fetchUsers = async () => { users.value = await $fetch('/api/users') }

  // Fetch Data
  onMounted(async () => {
    fetchUsers()
  })
  
  // Delete User
  const deleteUser = async (item) => {

    let permit =  (item.expenses.length > 0) ? 
        await confirmDialog({ 
            title: "Please Confirm", 
            text: `"${item.name}"" has ${item.trips.length} trips and ${item.expenses.length} expenses. All connected expenses in all relevant trips will be deleted.   Continue ?`,
            level: 'warning',
            // icon: 'mdi-emoticon-happy-outline',
            cancelText: 'Cancel',
            confirmationText: 'Ok',
        }) : true

    if ( permit ) {

      await $fetch('/api/users', {
        method: 'DELETE',
        body: item
      })
      refreshUsers()
    }  
  }

  const refreshUsers = async () => {
    fetchUsers()
  }
</script>

<style lang="css" scoped>
.button-container {
  display: flex;
}
</style>
  