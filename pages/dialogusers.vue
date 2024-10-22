<template>
    <v-container>
        <h2>Manage Users</h2>
      <v-row>
        <v-col>
          <v-data-table 
            :items="dialogusers"
            :headers="users_header"
            density="compact"
            hide-default-footer
            hide-default-header
          >
          <template v-slot:item="row">
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
      <v-divider></v-divider>
        <!-- Hier fügst du das Formular für Users ein-->
        <v-form v-model="isFormValid" ref="form">
        <v-text-field label="User Name" v-model="dialoguser.name" :rules="nameRules" required></v-text-field>
        <v-text-field label="User Email" v-model="dialoguser.email" :rules="emailRules" required></v-text-field>  
        <v-btn @click="submitForm">Add User</v-btn>
      </v-form>
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
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
 
  const EmailRules = [
    v => !!v || 'Email is required',
  ]

  const { data } = await useFetch('/api/dialogusers')
  dialogusers.value = data.value
  
  const submitForm = async () => {
    if (!isFormValid.value) return
  
    await $fetch('/api/dialogusers', {
      method: 'POST',
      body: dialoguser.value
    })
    const { data } = await useFetch('/api/dialogusers')
    dialogusers.value = data.value
  }

  const deleteUser = async (item) => {
    await $fetch('/api/dialogusers', {
      method: 'DELETE',
      body: item
    })
    const { data } = await useFetch('/api/dialogusers')
    dialogusers.value = data.value
  }

  const users_header = [
    { title: 'Name', key: 'name', align: 'start' },
    { title: 'Email', key: 'email', align: 'start' },
  ]

  </script>
  