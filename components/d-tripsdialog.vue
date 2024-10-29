<template>
    <v-dialog
    v-model="dialog"
    max-width="410"
    >
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-cash-register"
        color="surface-variant"
        rounded="0"
        elevation="1"
        text="+"
        novariant="tonal"
        v-bind="activatorProps"
        ></v-btn>
    </template>
        <v-card>
        <v-card-title>Add Trip</v-card-title>
        <v-card-text>
            <v-form 
                ref="form" 
                v-model="isFormValid" 
                lazy-validation
            >
                <v-row dense>
                    <v-text-field
                        label="Trip Name"
                        v-model="dialogtrip.name"
                        :rules="[v => !!v || 'Name is required']"
                        required
                        density="compact"
                    ></v-text-field>
                </v-row>
                <v-row dense>
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
  
            <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-form>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Add" @click="submitForm">Add</v-btn>
            <v-btn text="Close" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import VueCookies from 'vue-cookies'

    const props = defineProps(['selectedTrip']);
    const emit = defineEmits(['refresh']);

    const isFormValid = ref(false)
    const dialog = ref(false)
    const dialogtrips = ref([])
    const dialogusers = ref([])
    const userError = ref(false) // Error for user selection
    const selected = ref([]) // Keep track of selected users

    //const lselectedTrip = ref(null)

    // State
    const dialogtrip = ref({
    name: '',
    startDate: null,
    users: {},
    })

    // Reset Form
    const resetForm = () => {
    dialogtrip.value = { name: '', startDate: null, users: {} }
    selected.value = []
    userError.value = false
    }

    // Fetch Data on Mount
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

    // Close Dialog without Submission of data
    const closeDialog = () => {
        resetForm()
        dialog.value = false
    }
</script>