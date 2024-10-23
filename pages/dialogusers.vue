<template>
    <v-container>
        <h2>Manage Users</h2>
      <v-row>
        <v-col>
          <v-data-table 
            :items="dialogusers"
            :headers="usersHeaders"
            density="compact"
            hide-default-footer
          >
          <template v-slot:item="row">
                    <!-- the data table fields displayed in th elist are defined her -->
                    <!-- alternatively you could define the fields in dialogusers.ts -->
                    <!-- with select, then you would transfer less data ...          -->
                    <tr>
                      <td> {{ row.item.name }} </td>
                      <td> {{ row.item.email }} </td>
                      <td>
                        <v-btn
                          class="ma-2"
                          rounded="0"
                          size="x-small" 
                          color="grey"
                          elevation="8"
                          @click="deleteUser(row.item)"
                          icon="mdi-delete">
                        </v-btn>
                      </td>
                    </tr>
                  </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-divider color="black" thickness="1"></v-divider>

      <!-- Add Trip Dialog -->
      <v-dialog v-model="isUsersDialogOpen" max-width="500">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="surface-variant"
            class="mt-2"
            variant="flat"
          >
            Add User
          </v-btn>
        </template>

        <v-card>
          <v-card-title>Add User</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
              <v-text-field label="User Name" v-model="dialoguser.name" :rules="nameRules" required></v-text-field>
              <v-text-field label="User Email" v-model="dialoguser.email" :rules="emailRules" required></v-text-field>  
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
            text="Debug"
            color="surface"
            class="ml-2 mt-2"
            variant="flat"
            @click="debug = !debug"
          ></v-btn>
      <pre v-if="debug">{{ dialogusers }}</pre>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  const dialoguser = ref({
    name: '',
    email: ''
  })
  
  const dialogusers = ref([])
  const isFormValid = ref(false)
  const isUsersDialogOpen = ref(false)
  const debug = ref(false)
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
 
  const EmailRules = [
    v => !!v || 'Email is required',
  ]

  const usersHeaders = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Email', key: 'email', align: 'start' },
    { title: 'Actions', key: 'actions', sortable: false },
  ]

  // Fetch Data
  onMounted(async () => {
    const { data: usersData } = await useFetch('/api/dialogusers')
    dialogusers.value = usersData.value
  })
  
  // Form Submission
  const submitForm = async () => {
    if (!isFormValid.value) return
  
    // Send data to API
    try {
      await $fetch('/api/dialogusers', {
        method: 'POST',
        body: dialoguser.value
      })

      // Refrsh Users
      const { data: usersData } = await useFetch('/api/dialogusers')
      dialogusers.value = usersData.value

      // Reset the form and close dialog
      resetForm()
      isUsersDialogOpen.value = false
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Reset Form
  const resetForm = () => {
    dialoguser.value = { name: '', email: '' }
  }

  // Close Dialog without Submission
  const closeDialog = () => {
    resetForm()
    isUsersDialogOpen.value = false
  }

  // Delete User
  const deleteUser = async (item) => {
    await $fetch('/api/dialogusers', {
      method: 'DELETE',
      body: item
    })

    // Refresh Users
    const { data: usersData } = await useFetch('/api/dialogusers')
    dialogusers.value = usersData.value
  }
  </script>
  