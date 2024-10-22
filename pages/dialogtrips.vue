<template>
    <v-container>
      <h2>Manage Trips</h2>
      <v-row>
            <v-col>
                <v-data-table 
                  :items="dialogtrips"
                  density="compact"
                  hide-default-header
                  hide-default-footer
                  select-strategy="single"
                >
                  <template v-slot:item="row">
                    <tr>
                      <td> {{ new Date(row.item.startDate).toLocaleDateString() }} </td>
                      <td> {{ row.item.name }} </td>
                      <td>                     
                        <span v-for="e in row.item.users">{{ e.user.name + ', '}}</span>
                      </td>
                      <td>
                        <v-btn
                          class="ma-2"
                          rounded="0"
                          size="x-small" 
                          color="grey"
                          elevation="8"
                          @click="deleteTrip(row.item)"
                          icon="mdi-delete">
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
            </v-col>
      </v-row>
      <v-divider
        color="black"
        thickness="1"
      ></v-divider>

      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            color="surface-variant"
            text="Add Trip"
            variant="flat"
            class="mt-2"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="Add Trip">
            <v-card-text>
              <v-form 
              v-model="isFormValid" 
              ref="form"
              class="mt-5">
              <!--pre>{{ dialogusers }}</pre-->
              <v-text-field 
                label="Trip Name" 
                v-model="dialogtrip.name" 
                :rules="nameRules" 
                required
                density="compact">
              </v-text-field>
              <v-row>
                <v-col>
                  <v-data-table
                    :items="dialogusers.value"
                    :headers="users_header"
                    v-model="selected"
                    density="compact"
                    hide-default-footer
                    hide-default-header
                    return-object
                    show-select
                  ></v-data-table>
                </v-col>
                <v-col>
                  <v-date-input 
                      label="Start Date"
                      v-model="dialogtrip.startDate"
                      density="compact"
                      required
                   ></v-date-input>
                </v-col>
              </v-row>
            </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                text="Add"
                @click="submitForm"
              ></v-btn>
              <v-btn
                text="Close"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app'
  
  const dialogtrip = ref({
    name: '',
    startDate: null,
    users: {}
  })

  const dialogtrips = ref([])
  const dialogusers = ref([])
  const selected = ref([])
  const isFormValid = ref(false)
  
  const nameRules = [
    v => !!v || 'Name is required',
  ]
  
  const { data } = await useFetch('/api/dialogtrips')
  dialogtrips.value = data.value
  
  const help = await useFetch('/api/dialogusers')
  dialogusers.value = help["data"]

  const submitForm = async () => {
    if (!isFormValid.value) return
    let userarray = []
    selected.value.forEach(element => {
      userarray.push({ userId: element["id"]})
    });
    dialogtrip.value.users = {
      create: userarray
    }
    await $fetch('/api/dialogtrips', {
      method: 'POST',
      body: dialogtrip.value
    })
    const { data } = await useFetch('/api/dialogtrips')
    dialogtrips.value = data.value

    dialogtrip.value.name = ''
    dialogtrip.value.startDate = null
    dialogtrip.value.users = null
    selected.value = []
    $emit('close')
  }

  const deleteTrip = async (item) => {
    await $fetch('/api/dialogtrips', {
      method: 'DELETE',
      body: item
    })
    const { data } = await useFetch('/api/dialogtrips')
    dialogtrips.value = data.value
  }

  const users_header = [
    { title: 'Name', key: 'name', align: 'start' },
  ]

  </script>
  