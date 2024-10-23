<template>
  <v-container>
    <h2>Manage Trips</h2>
    <v-row>
      <v-col>
        <v-data-table
          :items="dialogtrips"
          :headers="tripsHeaders"
          density="compact"
          hide-default-footer

          select-strategy="single"
        >
          <template v-slot:item.startDate="{ item }">
            {{ new Date(item.startDate).toLocaleDateString() }}
          </template>
          <template v-slot:item.users="{ item }">
            <span v-for="(e, index) in item.users" :key="index">
              {{ e.user.name }}<span v-if="index < item.users.length - 1">, </span>
            </span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              size="x-small"
              color="grey"
              elevation="2"
              @click="deleteTrip(item)"
              icon="mdi-delete"
            ></v-btn>
          </template>
        </v-data-table>
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

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

// Validation Rules
const nameRules = [v => !!v || 'Name is required']

// Data Table Headers
const tripsHeaders = [
  { text: 'Start Date', value: 'startDate' },
  { text: 'Trip Name', value: 'name' },
  { text: 'Participants', value: 'users' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const usersHeaders = [
  { text: 'Name', value: 'name' },
]

// Fetch Data
onMounted(async () => {
  const { data: tripsData } = await useFetch('/api/dialogtrips')
  dialogtrips.value = tripsData.value

  const { data: usersData } = await useFetch('/api/dialogusers')
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
    await $fetch('/api/dialogtrips', {
      method: 'POST',
      body: dialogtrip.value,
    })

    // Refresh trips
    const { data } = await useFetch('/api/dialogtrips')
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
  await $fetch('/api/dialogtrips', {
    method: 'DELETE',
    body: item,
  })

  // Refresh trips
  const { data } = await useFetch('/api/dialogtrips')
  dialogtrips.value = data.value
}
</script>
