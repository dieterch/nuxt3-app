<template>
  <v-container>
    <h2>Manage Trips</h2>
    <v-row>
      <v-col>
        <d-table
          :items="dialogtrips"
          :headers="tripsHeaders"
          :show=true
        >
            <template v-slot:item.users="{ item }">
              <span v-for="(e, index) in item.users" :key="index">
                {{ e.user.name }}<span v-if="index < item.users.length - 1">, </span>
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <d-delbtn @click="deleteTrip(item)"/>
            </template>
        </d-table>
      </v-col>
    </v-row>

    <v-divider color="black" thickness="1"></v-divider>

    <!-- Add Trip Dialog -->
    <v-dialog v-model="isDialogOpen" max-width="500">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="surface-variant"
          class="mt-2"
          variant="flat"
        >
          Add Trip
        </v-btn>
      </template>

      <v-card>
        <v-card-title>Add Trip</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
            <v-text-field
              label="Trip Name"
              v-model="dialogtrip.name"
              :rules="nameRules"
              required
              density="compact"
            ></v-text-field>
            <v-row>
              <v-col>
                <v-data-table
                  :items="dialogusers"
                  :headers="usersHeaders"
                  v-model="selected"
                  density="compact"
                  hide-default-footer
                  hide-default-header
                  return-object
                  show-select
                ></v-data-table>
                <!-- User selection validation message -->
                <v-alert
                  v-if="userError"
                  type="error"
                  dense
                  text
                >
                  At least one user must be selected.
                </v-alert>
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
    <pre v-if="debug">{{ dialogtrips }}</pre>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { useFetch } from '#app'

// State
const dialogtrip = ref({
  name: '',
  startDate: null,
  users: {},
})

const dialogtrips = ref([])
const dialogusers = ref([])
const selected = ref([]) // Keep track of selected users
const isFormValid = ref(false)
const isDialogOpen = ref(false)
const userError = ref(false) // Error for user selection
const debug = ref(false)

// Validation Rules
const nameRules = [v => !!v || 'Name is required']

// Data Table Headers
const tripsHeaders = [
  // { title: 'Start Date', key: 'startDate' },
  { title: 'Start Date', key: 'formateddate', width: "15%", value: item => new Date(item.startDate).toLocaleDateString("de-CA", {year:"numeric", month: "2-digit", day:"2-digit"}), sortable: "false", align: "end"},
  { title: 'Trip Name', key: 'name', width: "30%" },
  { title: 'Participants', key: 'users' },
  { title: 'Actions', key: 'actions', align: 'center', width: "5%" , sortable: false },
]

// const usersHeaders = [
//   { title: 'Name', key: 'name' },
// ]

// Fetch Data
onMounted(async () => {
  const { data: tripsData } = await useFetch('/api/trips')
  dialogtrips.value = tripsData.value

  const { data: usersData } = await useFetch('/api/users')
  dialogusers.value = usersData.value
})

// Form Submission
const submitForm = async () => {
  // Check if form is valid and if at least one user is selected
  if (!isFormValid.value || selected.value.length === 0) {
    userError.value = selected.value.length === 0
    return
  }

  // Prepare users for submission
  const userArray = selected.value.map(element => ({
    userId: element.id,
  }))

  dialogtrip.value.users = { create: userArray }

  // Send data to API
  try {
    await $fetch('/api/trips', {
      method: 'POST',
      body: dialogtrip.value,
    })

    // Refresh trips
    const { data } = await useFetch('/api/trips')
    dialogtrips.value = data.value

    // Reset the form and close dialog
    resetForm()
    isDialogOpen.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

// Reset Form
const resetForm = () => {
  dialogtrip.value = { name: '', startDate: null, users: {} }
  selected.value = []
  userError.value = false
}

// Close Dialog without Submission
const closeDialog = () => {
  resetForm()
  isDialogOpen.value = false
}

// Delete Trip
const deleteTrip = async (item) => {
  await $fetch('/api/trips', {
    method: 'DELETE',
    body: item,
  })

  // Refresh trips
  const { data } = await useFetch('/api/trips')
  dialogtrips.value = data.value
}
</script>
